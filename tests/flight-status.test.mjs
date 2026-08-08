import assert from 'node:assert/strict';
import test from 'node:test';
import handler, { normalizeFlightNumber, normalizeFlightPayload } from '../api/flight-status.js';

const originalFetch = globalThis.fetch;
const originalKey = process.env.AVIATIONSTACK_API_KEY;

function responseRecorder() {
  return {
    headers: {},
    statusCode: 0,
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
    end() {
      return this;
    }
  };
}

function providerFlight({
  number = 'KU411',
  status = 'scheduled',
  scheduled = '2026-08-19T13:40:00+03:00',
  estimated = null,
  actual = null,
  delay = 0
} = {}) {
  return {
    flight_status: status,
    flight: { iata: number },
    departure: {
      airport: 'Kuwait International',
      iata: 'KWI',
      timezone: 'Asia/Kuwait',
      scheduled,
      estimated,
      actual,
      delay
    },
    arrival: { airport: 'Suvarnabhumi', iata: 'BKK', timezone: 'Asia/Bangkok' }
  };
}

test.afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.AVIATIONSTACK_API_KEY;
  else process.env.AVIATIONSTACK_API_KEY = originalKey;
});

test('normalizes on-time, delayed, changed-delay, cleared-delay, and departed states', () => {
  const onTime = normalizeFlightPayload(providerFlight(), 'KU411', '2026-08-08T00:00:00.000Z');
  assert.equal(onTime.delay, 0);
  assert.equal(onTime.estimatedDeparture, null);
  assert.equal(onTime.departure.timezone, 'Asia/Kuwait');
  assert.equal(onTime.arrival.timezone, 'Asia/Bangkok');

  const delayed = normalizeFlightPayload(
    providerFlight({ estimated: '2026-08-19T14:15:00+03:00', delay: 35 }),
    'KU411'
  );
  assert.equal(delayed.delay, 35);
  assert.equal(delayed.estimatedDeparture, '2026-08-19T14:15:00+03:00');

  const changed = normalizeFlightPayload(
    providerFlight({ estimated: '2026-08-19T14:30:00+03:00', delay: 50 }),
    'KU411'
  );
  assert.equal(changed.delay, 50);
  assert.equal(changed.estimatedDeparture, '2026-08-19T14:30:00+03:00');

  const cleared = normalizeFlightPayload(providerFlight({ estimated: '2026-08-19T13:40:00+03:00', delay: 0 }), 'KU411');
  assert.equal(cleared.delay, 0);
  assert.equal(cleared.estimatedDeparture, null);

  const departed = normalizeFlightPayload(
    providerFlight({ status: 'active', actual: '2026-08-19T13:52:00+03:00', delay: 12 }),
    'KU411'
  );
  assert.equal(departed.flightStatus, 'active');
  assert.equal(departed.actualDeparture, '2026-08-19T13:52:00+03:00');
});

test('rejects invalid flight numbers and timestamps without explicit timezone', () => {
  assert.equal(normalizeFlightNumber(' KU 411 '), 'KU411');
  assert.equal(normalizeFlightNumber('not-a-flight'), '');
  assert.equal(normalizeFlightPayload(providerFlight({ scheduled: '2026-08-19T13:40:00' }), 'KU411'), null);
});

test('server validates input, handles provider failure, and caches repeated button requests', async () => {
  process.env.AVIATIONSTACK_API_KEY = 'server-only-test-key';

  const invalidResponse = responseRecorder();
  await handler(
    { method: 'GET', headers: {}, query: { flightNumber: 'bad!', flightDate: '2026-99-99' } },
    invalidResponse
  );
  assert.equal(invalidResponse.statusCode, 400);

  globalThis.fetch = async () => ({ ok: false, json: async () => ({ error: { message: 'provider down' } }) });
  const failedResponse = responseRecorder();
  await handler(
    { method: 'GET', headers: {}, query: { flightNumber: 'XY900', flightDate: '2026-08-19' } },
    failedResponse
  );
  assert.equal(failedResponse.statusCode, 502);

  let providerCalls = 0;
  globalThis.fetch = async () => {
    providerCalls += 1;
    return { ok: true, json: async () => ({ data: [providerFlight({ number: 'AB123' })] }) };
  };
  const request = {
    method: 'GET',
    headers: { origin: 'https://faisalq896.github.io' },
    query: { flightNumber: 'AB123', flightDate: '2026-08-19' }
  };
  const firstResponse = responseRecorder();
  const secondResponse = responseRecorder();
  await handler(request, firstResponse);
  await handler(request, secondResponse);
  assert.equal(firstResponse.statusCode, 200);
  assert.equal(secondResponse.statusCode, 200);
  assert.equal(providerCalls, 1);
  assert.equal(secondResponse.headers['X-TravelTrip-Cache'], 'HIT');
});

test('server returns not found without exposing or inventing flight data', async () => {
  process.env.AVIATIONSTACK_API_KEY = 'server-only-test-key';
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ data: [] }) });
  const res = responseRecorder();
  await handler({ method: 'GET', headers: {}, query: { flightNumber: 'ZZ404', flightDate: '2026-08-19' } }, res);
  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { error: 'Flight was not found for this date.' });
});
