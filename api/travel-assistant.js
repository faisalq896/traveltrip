const MAX_QUESTION_LENGTH = 300;
const DEFAULT_ALLOWED_ORIGIN = 'https://faisalq896.github.io';

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return true;
}

function text(value, limit = MAX_QUESTION_LENGTH) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

export default async function handler(req, res) {
  if (!setCors(req, res)) return res.status(403).json({ error: 'Origin is not allowed.' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Travel assistant is not configured.' });
  const question = text(req.body?.question);
  const city = text(req.body?.city, 80);
  if (!question || !city) return res.status(400).json({ error: 'Question and city are required.' });
  const schedule = JSON.stringify(req.body?.schedule || []).slice(0, 6000);
  const weather = JSON.stringify(req.body?.weather || {}).slice(0, 1200);
  const configuredModel = text(process.env.GEMINI_MODEL, 80) || 'gemini-3.6-flash';
  const model = configuredModel === 'gemini-2.5-flash' ? 'gemini-3.6-flash' : configuredModel;
  const prompt = `You are the premium AI travel assistant inside TRAVELTRIP. Use the user's real trip context and answer in clear Gulf Arabic. Be direct, practical, warm, and honest. Do not claim live availability. City: ${city}\nWeather: ${weather}\nItinerary: ${schedule}\nQuestion: ${question}\nReturn JSON only with: summary (clear answer, max 90 Arabic words), suggestions (array up to 4 objects: title, time in HH:MM, details, reason), tips (array up to 4 short strings), warning (short string or empty). Only suggest stops when useful.`;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 900,
            thinkingConfig: { thinkingLevel: 'minimal' },
            responseMimeType: 'application/json'
          }
        })
      }
    );
    if (!response.ok) return res.status(502).json({ error: 'Travel assistant request failed.' });
    const payload = await response.json();
    const answer = (payload.candidates?.[0]?.content?.parts || [])
      .filter((part) => !part.thought && typeof part.text === 'string')
      .map((part) => part.text)
      .join('\n')
      .trim();
    if (!answer) return res.status(502).json({ error: 'Travel assistant returned an empty answer.' });
    let result;
    try {
      result = JSON.parse(answer);
    } catch {
      result = { summary: answer.slice(0, 1200), suggestions: [], tips: [], warning: '' };
    }
    return res.status(200).json({
      summary: text(result.summary, 1200),
      suggestions: Array.isArray(result.suggestions)
        ? result.suggestions.slice(0, 4).map((item) => ({
            title: text(item?.title, 120),
            time: text(item?.time, 5),
            details: text(item?.details, 220),
            reason: text(item?.reason, 180)
          }))
        : [],
      tips: Array.isArray(result.tips)
        ? result.tips
            .slice(0, 4)
            .map((item) => text(item, 180))
            .filter(Boolean)
        : [],
      warning: text(result.warning, 240)
    });
  } catch {
    return res.status(502).json({ error: 'Travel assistant is temporarily unavailable.' });
  }
}
