const DEFAULT_ALLOWED_ORIGIN = 'https://faisalq896.github.io';
const SUCCESS_CACHE_TTL = 5 * 60 * 1000;
const FAILURE_CACHE_TTL = 30 * 1000;
const responseCache = new Map();
const pendingRequests = new Map();

function allowedOrigins() {
  return (process.env.TRAVELTRIP_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGIN)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && !allowedOrigins().includes(origin)) return false;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return true;
}

export function normalizeFlightNumber(value) {
  const normalized = typeof value === 'string' ? value.toUpperCase().replace(/\s+/g, '') : '';
  return /^[A-Z0-9]{2,3}\d{1,4}[A-Z]?$/.test(normalized) ? normalized : '';
}

function normalizeFlightDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return '';
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day
    ? value
    : '';
}

function safeText(value, maxLength = 120) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function safeTimestamp(value) {
  if (typeof value !== 'string' || !/(Z|[+-]\d{2}:?\d{2})$/.test(value) || !Number.isFinite(Date.parse(value)))
    return null;
  return value;
}

function calculateDelay(departure) {
  const provided = Number(departure?.delay);
  if (Number.isFinite(provided) && provided >= 0) return Math.round(provided);
  const scheduled = safeTimestamp(departure?.scheduled);
  const estimated = safeTimestamp(departure?.estimated);
  if (!scheduled || !estimated) return 0;
  return Math.max(0, Math.round((Date.parse(estimated) - Date.parse(scheduled)) / 60000));
}

export function normalizeFlightPayload(flight, requestedNumber, fetchedAt = new Date().toISOString()) {
  const departure = flight?.departure || {};
  const arrival = flight?.arrival || {};
  const scheduledDeparture = safeTimestamp(departure.scheduled);
  if (!scheduledDeparture) return null;
  const delay = calculateDelay(departure);
  const estimated = safeTimestamp(departure.estimated);
  return {
    flightNumber: normalizeFlightNumber(flight?.flight?.iata || requestedNumber) || requestedNumber,
    flightStatus: safeText(flight?.flight_status, 40) || 'unknown',
    scheduledDeparture,
    estimatedDeparture: delay > 0 ? estimated : null,
    actualDeparture: safeTimestamp(departure.actual),
    delay,
    departure: {
      airport: safeText(departure.airport),
      iata: safeText(departure.iata, 8),
      timezone: safeText(departure.timezone, 80)
    },
    arrival: {
      airport: safeText(arrival.airport),
      iata: safeText(arrival.iata, 8),
      timezone: safeText(arrival.timezone, 80)
    },
    lastUpdated: fetchedAt
  };
}

export function selectFlight(data, flightNumber, flightDate) {
  if (!Array.isArray(data)) return null;
  const exact = data.filter((item) => normalizeFlightNumber(item?.flight?.iata) === flightNumber);
  return (
    exact.find((item) => safeTimestamp(item?.departure?.scheduled)?.slice(0, 10) === flightDate) || exact[0] || null
  );
}

async function requestAviationstack(flightNumber, flightDate) {
  const url = new URL('https://api.aviationstack.com/v1/flights');
  url.searchParams.set('access_key', process.env.AVIATIONSTACK_API_KEY);
  url.searchParams.set('flight_iata', flightNumber);
  url.searchParams.set('flight_date', flightDate);
  url.searchParams.set('limit', '10');
  const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(12000) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.error) throw new Error('Aviationstack request failed.');
  const flight = selectFlight(payload.data, flightNumber, flightDate);
  if (!flight) {
    const error = new Error('Flight not found.');
    error.code = 'NOT_FOUND';
    throw error;
  }
  const normalized = normalizeFlightPayload(flight, flightNumber);
  if (!normalized) throw new Error('Aviationstack returned an invalid departure time.');
  return normalized;
}

export default async function handler(req, res) {
  if (!setCors(req, res)) return res.status(403).json({ error: 'Origin is not allowed.' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.AVIATIONSTACK_API_KEY) return res.status(503).json({ error: 'Flight tracking is not configured.' });

  const flightNumber = normalizeFlightNumber(req.query?.flightNumber);
  const flightDate = normalizeFlightDate(req.query?.flightDate);
  if (!flightNumber || !flightDate)
    return res.status(400).json({ error: 'A valid flight number and date are required.' });

  const cacheKey = `${flightNumber}:${flightDate}`;
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    res.setHeader('X-TravelTrip-Cache', 'HIT');
    return res.status(cached.status).json(cached.body);
  }

  let pending = pendingRequests.get(cacheKey);
  if (!pending) {
    pending = requestAviationstack(flightNumber, flightDate).finally(() => pendingRequests.delete(cacheKey));
    pendingRequests.set(cacheKey, pending);
  }

  try {
    const body = await pending;
    responseCache.set(cacheKey, { status: 200, body, expiresAt: Date.now() + SUCCESS_CACHE_TTL });
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    res.setHeader('X-TravelTrip-Cache', 'MISS');
    return res.status(200).json(body);
  } catch (error) {
    const status = error?.code === 'NOT_FOUND' ? 404 : 502;
    const body = {
      error: status === 404 ? 'Flight was not found for this date.' : 'Flight status is temporarily unavailable.'
    };
    responseCache.set(cacheKey, { status, body, expiresAt: Date.now() + FAILURE_CACHE_TTL });
    return res.status(status).json(body);
  }
}
