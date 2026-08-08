import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const readProjectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the app shell loads data before application logic', async () => {
  const html = await readProjectFile('index.html');
  const cssReference = 'assets/css/app.css';
  const dataReference = 'data.js?v=';
  const appReference = 'assets/js/app.js';

  assert.ok(html.includes(cssReference), 'index.html must load the extracted stylesheet');
  assert.ok(html.includes(dataReference), 'index.html must load the place data');
  assert.ok(html.includes(appReference), 'index.html must load the application script');
  assert.ok(html.indexOf(dataReference) < html.indexOf(appReference), 'data must load before application logic');
});

test('service worker updates silently without interrupting the current trip', async () => {
  const [worker, appSource, html] = await Promise.all([
    readProjectFile('sw.js'),
    readProjectFile('assets/js/app.js'),
    readProjectFile('index.html')
  ]);

  assert.ok(!worker.includes('self.skipWaiting()'), 'service worker must not replace a running version mid-session');
  assert.ok(worker.includes("event.request.mode === 'navigate'"), 'page navigations must check the network for a new version');
  assert.ok(!appSource.includes("serviceWorker.addEventListener('controllerchange'"), 'the app must never reload when a service worker activates');
  assert.ok(!html.includes('id="appUpdate"'), 'the update prompt must not be shown');
});

test('GitHub Pages uses the public serverless price endpoint', async () => {
  const html = await readProjectFile('index.html');

  assert.ok(html.includes('https://traveltrip-traveltrip.vercel.app/api/travel-price'), 'the static site must not call a nonexistent GitHub Pages API path');
});

test('default itineraries use the configured 2026 Thailand trip dates', async () => {
  const appSource = await readProjectFile('assets/js/app.js');

  for (const date of ['19 أغسطس', '20 أغسطس', '21 أغسطس', '22 أغسطس', '23 أغسطس', '25 أغسطس', '26 أغسطس', '27 أغسطس']) {
    assert.ok(appSource.includes(`date: '${date}'`) || appSource.includes(`date: "${date}"`), `missing corrected date ${date}`);
  }
  assert.ok(!appSource.includes("date: '15 أغسطس'") && !appSource.includes('date: "15 أغسطس"'), 'legacy August 15 dates must not remain in defaults');
  assert.ok(appSource.includes("tripDate: '2026-08-19T13:40:00+07:00'"), 'Phuket countdown must include Thailand offset');
  assert.ok(appSource.includes("tripDate: '2026-08-25T12:35:00+07:00'"), 'Bangkok countdown must include Thailand offset');
});

test('Thailand dates, config, language, and hotel placeholders are safe', async () => {
  const appSource = await readProjectFile('assets/js/app.js');

  assert.ok(appSource.includes("timeZone: 'Asia/Bangkok'"), 'Thailand timezone must be explicit');
  assert.ok(appSource.includes('getThailandDateIso(today)'), 'today card must use the Thailand calendar date');
  assert.ok(!appSource.includes('getPhuketNowParts'), 'city-specific time helper name must be removed');
  assert.ok(appSource.includes("const appConfig = { ...(window.TRAVEL_APP_CONFIG || {}), ...(window.TRAVELTRIP_CONFIG || {}) }"), 'app config must use the unified TRAVELTRIP config with legacy compatibility');
  assert.ok(appSource.includes(": 'ar',\n  selectedCity"), 'Arabic must be the default when no preference exists');
  assert.equal((appSource.match(/Skyline Riverside Hotel/g) || []).length, 1, 'the old hotel name may appear only in the saved-data migration');
  assert.ok(!appSource.includes('+66 2 555 1234'), 'fake Bangkok phone data must be removed');
});

test('PDF dependency is local and available in the offline app shell', async () => {
  const [html, worker, pdfBundle] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('sw.js'),
    readProjectFile('assets/vendor/html2pdf.bundle.min.js')
  ]);

  assert.ok(html.includes('assets/vendor/html2pdf.bundle.min.js'), 'HTML must load the local PDF bundle');
  assert.ok(!html.includes('cdnjs.cloudflare.com'), 'HTML must not depend on the PDF CDN');
  assert.ok(worker.includes("'./assets/vendor/html2pdf.bundle.min.js?v=0.14.0'"), 'service worker must cache the exact local PDF bundle URL');
  assert.ok(worker.includes("'./assets/js/app.js?v=20260808-4'"), 'service worker must cache the exact versioned application URL');
  assert.ok(pdfBundle.length > 500000, 'local PDF bundle appears incomplete');
});

test('Gemini endpoint uses the current stable Flash model', async () => {
  const endpoint = await readProjectFile('api/travel-price.js');

  assert.ok(endpoint.includes("'gemini-3.6-flash'"), 'the endpoint must use a currently available Gemini model');
  assert.ok(!endpoint.includes('temperature:'), 'new Gemini models must not receive deprecated sampling parameters');
});

test('client-side source files have valid JavaScript syntax', async () => {
  const [dataSource, appSource] = await Promise.all([readProjectFile('data.js'), readProjectFile('assets/js/app.js')]);

  assert.doesNotThrow(() => new vm.Script(dataSource), 'data.js must parse');
  assert.doesNotThrow(() => new vm.Script(appSource), 'app.js must parse');
});
