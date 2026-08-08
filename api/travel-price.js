const MAX_TEXT_LENGTH = 160;
const DEFAULT_ALLOWED_ORIGIN = 'https://faisalq896.github.io';

function getAllowedOrigins() {
  return (process.env.TRAVELTRIP_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGIN)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  if (origin && !allowedOrigins.includes(origin)) return false;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return true;
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim().slice(0, MAX_TEXT_LENGTH) : '';
}

function readJson(text) {
  const match = String(text || '').match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (!setCorsHeaders(req, res)) return res.status(403).json({ error: 'Origin is not allowed.' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Gemini price estimation is not configured.' });

  const place = cleanText(req.body?.place);
  const city = cleanText(req.body?.city);
  const category = cleanText(req.body?.category);
  const priceHint = cleanText(req.body?.priceHint);
  if (!place || !city || !category) return res.status(400).json({ error: 'Missing place details.' });

  const prompt = `Estimate the typical current per-person visitor cost in Thai baht for this Thailand travel selection.\nPlace: ${place}\nCity: ${city}\nCategory: ${category}\nExisting price hint: ${priceHint || 'none'}\nReturn JSON only with: low (integer THB), high (integer THB), note (Arabic, max 16 words). Use a realistic range. For malls without a fixed entry cost, return 0 for both values and say that spending varies. Do not invent a booking or live availability.`;
  try {
    const configuredModel = cleanText(process.env.GEMINI_MODEL) || 'gemini-3.6-flash';
    const model = configuredModel === 'gemini-2.5-flash' ? 'gemini-3.6-flash' : configuredModel;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 512,
            thinkingConfig: { thinkingLevel: 'minimal' },
            responseMimeType: 'application/json'
          }
        })
      }
    );
    if (!response.ok) {
      const providerPayload = await response.json().catch(() => ({}));
      const providerError = providerPayload?.error || {};
      const providerStatus = cleanText(providerError.status).replace(/[^A-Z_]/g, '');
      const status = response.status === 401 || response.status === 429 ? response.status : 502;
      const reason =
        response.status === 401
          ? 'Gemini API key is invalid or inactive.'
          : response.status === 429
            ? 'Gemini free-tier rate limit was reached. Try again later.'
            : providerError.type === 'invalid_request_error'
              ? 'Gemini rejected the requested model or request configuration.'
              : 'Gemini provider request failed.';
      return res.status(status).json({
        error: reason,
        providerStatus: providerStatus || 'UNKNOWN',
        providerMessage: cleanText(providerError.message).slice(0, 180)
      });
    }
    const payload = await response.json();
    const responseText = (payload.candidates?.[0]?.content?.parts || [])
      .filter((part) => !part.thought && typeof part.text === 'string')
      .map((part) => part.text)
      .join('\n');
    const result = readJson(responseText);
    const low = Number(result?.low);
    const high = Number(result?.high);
    if (!Number.isFinite(low) || !Number.isFinite(high) || low < 0 || high < low || high > 100000) {
      return res.status(502).json({ error: 'Invalid AI estimate.' });
    }
    return res.status(200).json({ low: Math.round(low), high: Math.round(high), note: cleanText(result.note) });
  } catch {
    return res.status(502).json({ error: 'AI estimate is temporarily unavailable.' });
  }
}
