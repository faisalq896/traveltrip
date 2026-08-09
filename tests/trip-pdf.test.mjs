import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url));

async function loadPdfRuntime() {
  const [jsPdfSource, generatorSource, fontData] = await Promise.all([
    projectFile('assets/vendor/jspdf.umd.min.js'),
    projectFile('assets/js/trip-pdf.js'),
    projectFile('assets/fonts/Amiri-Regular.ttf')
  ]);
  const encodeBase64 = (value) => Buffer.from(value, 'binary').toString('base64');
  const decodeBase64 = (value) => Buffer.from(value, 'base64').toString('binary');
  const context = vm.createContext({
    Blob,
    Buffer,
    Uint8Array,
    ArrayBuffer,
    TextEncoder,
    TextDecoder,
    console,
    self: { btoa: encodeBase64, atob: decodeBase64 },
    btoa: encodeBase64,
    atob: decodeBase64
  });
  vm.runInContext(jsPdfSource.toString('utf8'), context, { filename: 'jspdf.umd.min.js' });
  context.jspdf = context.jspdf || context.self.jspdf;
  vm.runInContext(generatorSource.toString('utf8'), context, { filename: 'trip-pdf.js' });
  return { create: context.TravelTripPdf.createTripPdfBlob, jsPDF: context.jspdf.jsPDF, fontData };
}

function countPdfPages(bytes) {
  return (
    Buffer.from(bytes)
      .toString('latin1')
      .match(/\/Type\s*\/Page\b/g) || []
  ).length;
}

async function inspectPdf(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return {
    bytes,
    signature: Buffer.from(bytes.subarray(0, 5)).toString('ascii'),
    pages: countPdfPages(bytes)
  };
}

const phuketSchedule = [
  {
    day: 1,
    date: '19 أغسطس 2026',
    city: 'بوكيت',
    hotel: 'فندق المستخدم',
    items: [
      { time: '09:00', title: 'الإفطار', sub: 'مطعم قريب من الفندق' },
      { time: '14:30', title: 'شاطئ باتونغ', sub: 'نشاط أضافه المستخدم إلى الجدول' }
    ]
  }
];

test('direct PDF generator creates a real Phuket PDF with Arabic font and pages', async () => {
  const runtime = await loadPdfRuntime();
  const blob = await runtime.create({
    jsPDF: runtime.jsPDF,
    fontData: runtime.fontData,
    language: 'ar',
    destination: 'بوكيت',
    schedule: phuketSchedule
  });
  const pdf = await inspectPdf(blob);
  assert.equal(blob.type, 'application/pdf');
  assert.equal(pdf.signature, '%PDF-');
  assert.ok(blob.size > 10000, 'embedded Arabic PDF should not be empty');
  assert.ok(pdf.pages >= 1, 'Phuket PDF must contain a page');
});

test('direct PDF generator works for Bangkok and paginates a modified user schedule', async () => {
  const runtime = await loadPdfRuntime();
  const customItems = Array.from({ length: 38 }, (_, index) => ({
    time: `${String(8 + Math.floor(index / 4)).padStart(2, '0')}:${String((index % 4) * 15).padStart(2, '0')}`,
    title: `نشاط مخصص ${index + 1}`,
    sub: 'وصف معدل من المستخدم يجب أن ينتقل كاملًا إلى ملف الرحلة دون تصوير DOM.'
  }));
  const blob = await runtime.create({
    jsPDF: runtime.jsPDF,
    fontData: runtime.fontData,
    language: 'ar',
    destination: 'بانكوك',
    schedule: [{ day: 1, date: '25 أغسطس 2026', city: 'بانكوك', hotel: 'فندق مخصص', items: customItems }]
  });
  const pdf = await inspectPdf(blob);
  assert.equal(pdf.signature, '%PDF-');
  assert.ok(pdf.pages >= 2, 'long modified schedules must paginate automatically');
});

test('PDF architecture is data-driven and has no DOM screenshot dependency', async () => {
  const [generator, app, html, worker] = await Promise.all([
    projectFile('assets/js/trip-pdf.js').then((value) => value.toString('utf8')),
    projectFile('assets/js/app.js').then((value) => value.toString('utf8')),
    projectFile('index.html').then((value) => value.toString('utf8')),
    projectFile('sw.js').then((value) => value.toString('utf8'))
  ]);
  const combined = `${generator}\n${app}\n${html}\n${worker}`.toLowerCase();
  assert.ok(generator.includes('for (const day of schedule)'), 'generator must iterate live schedule data');
  assert.ok(app.includes('window.TravelTripPdf.createTripPdfBlob({'), 'share action must pass schedule data directly');
  assert.ok(!combined.includes('html2canvas'), 'PDF path must not contain html2canvas');
  assert.ok(!combined.includes('html2pdf'), 'PDF path must not contain html2pdf');
  assert.ok(
    !generator.includes('document.') && !generator.includes('canvas'),
    'generator must not capture DOM or canvas'
  );
});
