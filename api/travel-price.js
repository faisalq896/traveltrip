const MAX_TEXT_LENGTH = 160;
const DEFAULT_ALLOWED_ORIGIN = 'https://faisalq896.github.io';

function getAllowedOrigins() {
  return (process.env.TRAVELTRIP_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGIN)
    .split(',')
    .map(origin => origin.trim())
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
  try { return JSON.parse(match[0]); } catch { return null; }
}

export default async function handler(req, res) {
  if (!setCorsHeaders(req, res)) return res.status(403).json({ error: 'Origin is not allowed.' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'AI estimation is not configured.' });

  const place = cleanText(req.body?.place);
  const city = cleanText(req.body?.city);
  const category = cleanText(req.body?.category);
  const priceHint = cleanText(req.body?.priceHint);
  if (!place || !city || !category) return res.status(400).json({ error: 'Missing place details.' });

  const prompt = `Estimate the typical current per-person visitor cost in Thai baht for this Thailand travel selection.\nPlace: ${place}\nCity: ${city}\nCategory: ${category}\nExisting price hint: ${priceHint || 'none'}\nReturn JSON only with: low (integer THB), high (integer THB), note (Arabic, max 16 words). Use a realistic range. For malls without a fixed entry cost, return 0 for both values and say that spending varies. Do not invent a booking or live availability.`;
  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        input: prompt,
        max_output_tokens: 120,
        store: false
      })
    });
    if (!response.ok) return res.status(502).json({ error: 'AI provider request failed.' });
    const payload = await response.json();
    const result = readJson(payload.output_text);
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
