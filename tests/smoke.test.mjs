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
  assert.ok(
    worker.includes("event.request.mode === 'navigate'"),
    'page navigations must check the network for a new version'
  );
  assert.ok(
    !appSource.includes("serviceWorker.addEventListener('controllerchange'"),
    'the app must never reload when a service worker activates'
  );
  assert.ok(!html.includes('id="appUpdate"'), 'the update prompt must not be shown');
});

test('GitHub Pages uses the public serverless price endpoint', async () => {
  const html = await readProjectFile('index.html');

  assert.ok(
    html.includes('https://traveltrip-traveltrip.vercel.app/api/travel-price'),
    'the static site must not call a nonexistent GitHub Pages API path'
  );
});

test('default itineraries use the configured 2026 Thailand trip dates', async () => {
  const appSource = await readProjectFile('assets/js/app.js');

  for (const date of ['19 أغسطس', '20 أغسطس', '21 أغسطس', '22 أغسطس', '23 أغسطس', '25 أغسطس', '26 أغسطس', '27 أغسطس']) {
    assert.ok(
      appSource.includes(`date: '${date}'`) || appSource.includes(`date: "${date}"`),
      `missing corrected date ${date}`
    );
  }
  assert.ok(
    !appSource.includes("date: '15 أغسطس'") && !appSource.includes('date: "15 أغسطس"'),
    'legacy August 15 dates must not remain in defaults'
  );
  assert.ok(
    appSource.includes("tripDate: '2026-08-19T13:40:00+07:00'"),
    'Phuket countdown must include Thailand offset'
  );
  assert.ok(
    appSource.includes("tripDate: '2026-08-25T12:35:00+07:00'"),
    'Bangkok countdown must include Thailand offset'
  );
});

test('Thailand dates, config, language, and hotel placeholders are safe', async () => {
  const appSource = await readProjectFile('assets/js/app.js');

  assert.ok(appSource.includes("timeZone: 'Asia/Bangkok'"), 'Thailand timezone must be explicit');
  assert.ok(appSource.includes('getThailandDateIso(today)'), 'today card must use the Thailand calendar date');
  assert.ok(!appSource.includes('getPhuketNowParts'), 'city-specific time helper name must be removed');
  assert.ok(
    appSource.includes(
      'const appConfig = { ...(window.TRAVEL_APP_CONFIG || {}), ...(window.TRAVELTRIP_CONFIG || {}) }'
    ),
    'app config must use the unified TRAVELTRIP config with legacy compatibility'
  );
  assert.ok(appSource.includes(": 'ar',\n  selectedCity"), 'Arabic must be the default when no preference exists');
  assert.equal(
    (appSource.match(/Skyline Riverside Hotel/g) || []).length,
    1,
    'the old hotel name may appear only in the saved-data migration'
  );
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
  assert.ok(
    worker.includes("'./assets/vendor/html2pdf.bundle.min.js?v=0.14.0'"),
    'service worker must cache the exact local PDF bundle URL'
  );
  assert.ok(
    worker.includes("'./assets/js/app.js?v=20260808-9'"),
    'service worker must cache the exact versioned application URL'
  );
  assert.ok(pdfBundle.length > 500000, 'local PDF bundle appears incomplete');
});

test('PDF export renders visible content and rejects blank output', async () => {
  const [appSource, css] = await Promise.all([
    readProjectFile('assets/js/app.js'),
    readProjectFile('assets/css/app.css')
  ]);

  assert.ok(!css.includes('left: -20000px'), 'PDF content must not be rendered outside the capturable viewport');
  assert.ok(
    css.includes('.trip-pdf-document { position: fixed; left: 0; top: 0;'),
    'PDF content must be visible to html2canvas while the loading overlay is shown'
  );
  assert.ok(appSource.includes('await waitForPdfAssets(documentNode);'), 'PDF export must wait for fonts and images');
  assert.ok(
    appSource.includes("if (!pdfCanvasHasContent(canvas)) throw new Error('PDF canvas is blank');"),
    'blank canvases must be rejected'
  );
  assert.ok(appSource.includes("signature !== '%PDF-'"), 'invalid or empty PDF blobs must not be downloaded');
});

test('global search normalizes Arabic and includes category aliases', async () => {
  const appSource = await readProjectFile('assets/js/app.js');
  const start = appSource.indexOf('function normalizeSearchText');
  const end = appSource.indexOf('function openSearchResult', start);
  assert.ok(start >= 0 && end > start, 'search normalization functions must exist');

  const searchFunctions = appSource.slice(start, end);
  const normalize = Function(`${searchFunctions}; return normalizeSearchText;`)();
  assert.equal(normalize('  مَطَاعِم  '), 'مطاعم');
  assert.equal(normalize('مَقْهَى'), 'مقهي');
  assert.equal(normalize('  RESTAURANTS  '), 'restaurants');
  assert.ok(
    appSource.includes('مطعم مطاعم اكل طعام restaurant restaurants'),
    'restaurant category aliases must be searchable'
  );
  assert.ok(appSource.includes('مقهي مقاهي كافيه قهوة cafe cafes'), 'cafe category aliases must be searchable');

  const searchEnd = appSource.indexOf('function openEmergency', start);
  const fullSearchSource = appSource.slice(start, searchEnd);
  const runSearch = Function(
    'document',
    'getCityData',
    'state',
    'ui',
    'localizeContent',
    'escapeHtml',
    `${fullSearchSource}; doGlobalSearch();`
  );
  for (const query of ['مطعم', 'مطاعم', 'RESTAURANTS']) {
    const nodes = { globalSearch: { value: query }, searchResults: { innerHTML: '' } };
    runSearch(
      { getElementById: (id) => nodes[id] },
      () => ({
        hotels: [],
        restaurants: [{ id: 'r1', name: 'Test Restaurant', nameTh: '', type: 'طعام', halalNote: '', address: '' }],
        cafes: [],
        malls: [],
        activities: []
      }),
      { schedule: [], packing: [], notes: '' },
      (arabic, english) => (query === 'RESTAURANTS' ? english : arabic),
      (value) => value || '',
      (value) => String(value || '')
    );
    assert.ok(
      nodes.searchResults.innerHTML.includes('Test Restaurant'),
      `category query ${query} must return restaurants`
    );
  }
});

test('destination title, accessibility labels, and desktop layout remain explicit', async () => {
  const [html, appSource, css] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('assets/js/app.js'),
    readProjectFile('assets/css/app.css')
  ]);

  assert.ok(html.includes('<title>TravelTrip — اختر وجهتك</title>'), 'initial title must not assume Phuket');
  assert.ok(
    appSource.includes('TravelTrip — Choose your destination'),
    'destination picker title must support English'
  );
  assert.ok(html.includes('id="cityPickerBtnLabel">اختيار المدينة</span>'), 'city picker must have a visible label');
  assert.ok(
    !css.includes("content: 'مختار لرحلتك'"),
    'decorative repeated text must not be exposed to assistive technology'
  );
  assert.ok(css.includes('@media (min-width: 1024px)'), 'desktop layout must have a dedicated responsive breakpoint');
});

test('More menu labels map to their actual actions and expose manual flight refresh', async () => {
  const [html, appSource] = await Promise.all([readProjectFile('index.html'), readProjectFile('assets/js/app.js')]);

  assert.ok(
    html.includes('onclick="refreshCurrentFlightFromMore()"'),
    'More must expose the manual flight refresh action'
  );
  assert.ok(
    appSource.includes(
      "const moreLabels = [t('budget'), t('packing'), t('visited'), t('gallery'), t('notes'), t('refreshFlight'), t('theme'), t('chooseCity'), t('settings')];"
    ),
    'More labels must follow the same order as their actions'
  );
  assert.ok(
    appSource.includes(
      "const moreExploreLabels = [t('hotels'), t('restaurants'), t('cafes'), t('malls'), t('activities')];"
    ),
    'explore tile translations must remain separate from More list labels'
  );
});

test('bug audit regressions preserve user data and Thailand-local behavior', async () => {
  const appSource = await readProjectFile('assets/js/app.js');

  assert.ok(appSource.includes("'gallery', 'settings', 'visited'"), 'settings must remain a valid persisted section');
  assert.ok(appSource.includes("state.language = 'ar';"), 'full reset must return to the Arabic default');
  assert.ok(appSource.includes('date: getThailandDateIso()'), 'expense dates must use the Thailand calendar day');
  assert.ok(
    appSource.includes("document.getElementById(`b-${field}`).value = b[field] ?? ''"),
    'restoring a zero or empty budget must clear stale inputs'
  );
  assert.ok(
    appSource.includes("estimatedCostValue === '' ? null"),
    'an empty estimate must stay null instead of becoming zero'
  );
  assert.ok(
    appSource.includes('await navigator.clipboard.writeText(text)'),
    'clipboard rejections must be handled by the async copy flow'
  );
  assert.ok(
    appSource.includes('addScheduleItem(${dayIndex})'),
    'an empty existing Today entry must add an activity to that day'
  );
  assert.ok(
    appSource.includes('data-today-map=') && !appSource.includes("onclick=\"openMap('${escapeHtml(item.title)}')"),
    'user-entered activity names must not be embedded in inline JavaScript'
  );
  assert.ok(!appSource.includes('renderTripMap()'), 'schedule rendering must not call a missing map function');
  assert.ok(appSource.includes('refreshTripMap();'), 'schedule rendering must refresh the existing map implementation');
});

test('PWA install metadata provides local PNG icons for mobile platforms', async () => {
  const [html, manifestSource, worker, icon192, icon512] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('manifest.webmanifest'),
    readProjectFile('sw.js'),
    readFile(new URL('../assets/icons/app-icon-192.png', import.meta.url)),
    readFile(new URL('../assets/icons/app-icon-512.png', import.meta.url))
  ]);
  const manifest = JSON.parse(manifestSource);

  assert.ok(
    html.includes('rel="apple-touch-icon" href="assets/icons/app-icon-192.png"'),
    'iOS must receive a PNG touch icon'
  );
  assert.ok(
    manifest.icons.some((icon) => icon.sizes === '192x192' && icon.type === 'image/png'),
    'Android needs a 192px PNG icon'
  );
  assert.ok(
    manifest.icons.some((icon) => icon.sizes === '512x512' && icon.type === 'image/png'),
    'Android needs a 512px PNG icon'
  );
  assert.ok(
    worker.includes("'./assets/icons/app-icon-192.png'") && worker.includes("'./assets/icons/app-icon-512.png'"),
    'offline shell must cache both install icons'
  );
  assert.equal(icon192.readUInt32BE(16), 192);
  assert.equal(icon192.readUInt32BE(20), 192);
  assert.equal(icon512.readUInt32BE(16), 512);
  assert.equal(icon512.readUInt32BE(20), 512);
});

test('known broken external image URLs are not shipped', async () => {
  const source = `${await readProjectFile('data.js')}\n${await readProjectFile('assets/js/app.js')}`;
  for (const id of [
    '1574868235872-1663edcb4569',
    '1520328593999-9a2cd29b7252',
    '1495121605193-b116b5b9c5d1',
    '1583492723326-6b63d00192e2',
    '1540202404-b71188410214',
    '1558618666-fcd25c85f82e',
    '1519567281028-11a5b85d38cc'
  ]) {
    assert.ok(!source.includes(id), `broken image ${id} must use the local fallback`);
  }
});

test('flight tracking is manual, local-first, and keeps secrets off the frontend', async () => {
  const [html, appSource, worker] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('assets/js/app.js'),
    readProjectFile('sw.js')
  ]);
  const frontend = `${html}\n${appSource}\n${worker}`;

  assert.ok(html.includes('/api/flight-status'), 'frontend must use the Vercel flight endpoint');
  assert.ok(
    !frontend.includes('AVIATIONSTACK_API_KEY') && !frontend.includes('api.aviationstack.com'),
    'Aviationstack credentials and provider URL must remain server-side'
  );
  assert.ok(appSource.includes('setInterval(updateCountdown, 1000)'), 'countdown must continue locally every second');
  assert.ok(
    !appSource.includes('setInterval(refreshFlightStatus') && !appSource.includes('refreshFlightStatus();'),
    'flight status must never auto-refresh'
  );
  assert.ok(
    appSource.includes("['tg_flights', JSON.stringify(state.flights)]"),
    'successful flight data must be persisted locally'
  );
  assert.ok(
    appSource.includes('flightStatusEndpoint') && appSource.includes('navigator.onLine'),
    'manual refresh must use the configured endpoint and handle offline mode'
  );
  assert.ok(
    appSource.includes('flightRefreshBlockedUntil') && appSource.includes('Date.now() + 10000'),
    'rapid refresh clicks must be throttled'
  );
  assert.ok(
    appSource.includes("id: 'phuket-outbound'") && appSource.includes("id: 'bangkok-transfer'"),
    'flight state must support separate records rather than one hardcoded flight'
  );
});

test('Gemini endpoint uses the current stable Flash model', async () => {
  const endpoint = await readProjectFile('api/travel-price.js');

  assert.ok(endpoint.includes("'gemini-3.6-flash'"), 'the endpoint must use a currently available Gemini model');
  assert.ok(!endpoint.includes('temperature:'), 'new Gemini models must not receive deprecated sampling parameters');
});

test('AI prompts submit, fail safely, and add suggestions to a valid trip day', async () => {
  const [html, appSource] = await Promise.all([readProjectFile('index.html'), readProjectFile('assets/js/app.js')]);

  assert.ok(html.includes('ميزة AI'), 'the interface must not claim Gemini is connected before a request succeeds');
  assert.ok(appSource.includes('form.requestSubmit();'), 'quick prompts must submit instead of only filling the input');
  assert.ok(
    appSource.includes('renderTravelAiAnswer(buildLocalAssistantFallback(question));'),
    'failed AI requests must retain useful offline suggestions'
  );
  assert.ok(
    appSource.includes('scheduleDateToIso(day.date) === today'),
    'AI suggestions must prefer the current Thailand trip day'
  );
  assert.ok(appSource.includes('occupied.has(time)'), 'AI additions must avoid an existing activity time');
});

test('client-side source files have valid JavaScript syntax', async () => {
  const [dataSource, appSource] = await Promise.all([readProjectFile('data.js'), readProjectFile('assets/js/app.js')]);

  assert.doesNotThrow(() => new vm.Script(dataSource), 'data.js must parse');
  assert.doesNotThrow(() => new vm.Script(appSource), 'app.js must parse');
});
