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

test('service worker waits for an explicit update confirmation', async () => {
  const worker = await readProjectFile('sw.js');

  assert.ok(worker.includes("event.data?.type === 'SKIP_WAITING'"), 'service worker must support explicit activation');
  assert.ok(!worker.includes("then(() => self.skipWaiting())"), 'service worker must not force a refresh during installation');
});

test('client-side source files have valid JavaScript syntax', async () => {
  const [dataSource, appSource] = await Promise.all([readProjectFile('data.js'), readProjectFile('assets/js/app.js')]);

  assert.doesNotThrow(() => new vm.Script(dataSource), 'data.js must parse');
  assert.doesNotThrow(() => new vm.Script(appSource), 'app.js must parse');
});
