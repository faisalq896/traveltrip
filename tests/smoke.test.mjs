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

  assert.ok(worker.includes('self.skipWaiting()'), 'service worker must activate the new cache silently');
  assert.ok(!appSource.includes("serviceWorker.addEventListener('controllerchange'"), 'the app must never reload when a service worker activates');
  assert.ok(!html.includes('id="appUpdate"'), 'the update prompt must not be shown');
});

test('client-side source files have valid JavaScript syntax', async () => {
  const [dataSource, appSource] = await Promise.all([readProjectFile('data.js'), readProjectFile('assets/js/app.js')]);

  assert.doesNotThrow(() => new vm.Script(dataSource), 'data.js must parse');
  assert.doesNotThrow(() => new vm.Script(appSource), 'app.js must parse');
});
