(function initializeTravelTripPdf(global) {
  'use strict';

  const PAGE = { width: 210, height: 297, margin: 16, footer: 14 };
  const COLORS = {
    navy: [15, 54, 84],
    blue: [11, 131, 167],
    violet: [96, 84, 216],
    ink: [20, 40, 59],
    muted: [96, 121, 140],
    pale: [241, 247, 250],
    line: [224, 235, 241],
    white: [255, 255, 255]
  };
  let cachedFontBase64 = '';

  function safeText(value, fallback = '') {
    const text = String(value ?? fallback).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
    return text || fallback;
  }

  function arabicDigits(value) {
    return value.replace(/\d/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);
  }

  function bytesToBase64(bytes) {
    let binary = '';
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    if (typeof btoa === 'function') return btoa(binary);
    throw new Error('Base64 encoding is unavailable');
  }

  async function loadArabicFont(fontData, fontUrl) {
    if (fontData) return typeof fontData === 'string' ? fontData : bytesToBase64(new Uint8Array(fontData));
    if (cachedFontBase64) return cachedFontBase64;
    const response = await fetch(fontUrl || './assets/fonts/Amiri-Regular.ttf?v=1');
    if (!response.ok) throw new Error('Arabic PDF font could not be loaded');
    cachedFontBase64 = bytesToBase64(new Uint8Array(await response.arrayBuffer()));
    return cachedFontBase64;
  }

  function setColor(doc, kind, color) {
    const values = COLORS[color];
    doc[kind](...values);
  }

  function drawText(doc, text, x, y, options = {}) {
    const rtl = Boolean(options.rtl);
    const value = rtl ? arabicDigits(safeText(text, options.fallback || '-')) : safeText(text, options.fallback || '-');
    doc.setFontSize(options.size || 10);
    setColor(doc, 'setTextColor', options.color || 'ink');
    doc.text(value, x, y, {
      align: options.align || (rtl ? 'right' : 'left'),
      baseline: 'top',
      isInputRtl: rtl,
      maxWidth: options.maxWidth
    });
  }

  function splitLines(doc, text, width, size) {
    doc.setFontSize(size);
    const value = safeText(text, '-');
    const lines = doc.splitTextToSize(value, width);
    return lines.length ? lines : ['-'];
  }

  function drawLines(doc, lines, x, y, options = {}) {
    const lineHeight = options.lineHeight || (options.size || 10) * 0.42;
    lines.forEach((line, index) => drawText(doc, line, x, y + index * lineHeight, options));
    return lines.length * lineHeight;
  }

  function addPageHeader(doc, destination, rtl, continuation = false) {
    setColor(doc, 'setFillColor', 'navy');
    doc.rect(0, 0, PAGE.width, 24, 'F');
    drawText(doc, 'TRAVELTRIP', rtl ? PAGE.width - PAGE.margin : PAGE.margin, 6, {
      rtl: false,
      align: rtl ? 'right' : 'left',
      size: 14,
      color: 'white'
    });
    drawText(doc, continuation ? (rtl ? 'تكملة خطة الرحلة' : 'Itinerary continued') : destination, rtl ? PAGE.margin : PAGE.width - PAGE.margin, 7, {
      rtl,
      align: rtl ? 'left' : 'right',
      size: 9,
      color: 'white'
    });
  }

  function addNewPage(doc, destination, rtl, continuation = true) {
    doc.addPage('a4', 'portrait');
    addPageHeader(doc, destination, rtl, continuation);
    return 31;
  }

  function drawDayHeading(doc, day, y, rtl, continued = false) {
    const x = PAGE.margin;
    const width = PAGE.width - PAGE.margin * 2;
    setColor(doc, 'setFillColor', 'pale');
    doc.roundedRect(x, y, width, 22, 3, 3, 'F');
    setColor(doc, 'setDrawColor', 'line');
    doc.roundedRect(x, y, width, 22, 3, 3, 'S');
    const title = `${rtl ? 'اليوم' : 'Day'} ${safeText(day.day)}${continued ? (rtl ? ' - تكملة' : ' - continued') : ''}`;
    drawText(doc, title, rtl ? PAGE.width - PAGE.margin - 5 : PAGE.margin + 5, y + 3, { rtl, size: 13, color: 'blue' });
    drawText(doc, safeText(day.date), rtl ? PAGE.width - PAGE.margin - 5 : PAGE.margin + 5, y + 11, { rtl, size: 9, color: 'ink' });
    const location = [safeText(day.city), safeText(day.hotel, rtl ? 'الفندق غير محدد' : 'Hotel not specified')].filter(Boolean).join(' • ');
    drawText(doc, location, rtl ? PAGE.margin + 5 : PAGE.width - PAGE.margin - 5, y + 7, {
      rtl,
      align: rtl ? 'left' : 'right',
      size: 8,
      color: 'muted',
      maxWidth: 80
    });
    return y + 27;
  }

  function itemLayout(doc, item) {
    const titleLines = splitLines(doc, item.title, 132, 10.5);
    const descriptionLines = safeText(item.sub) ? splitLines(doc, item.sub, 132, 8.5) : [];
    const height = Math.max(18, 7 + titleLines.length * 4.5 + descriptionLines.length * 3.8);
    return { titleLines, descriptionLines, height };
  }

  function drawItem(doc, item, layout, y, rtl) {
    const timeWidth = 27;
    const contentX = rtl ? PAGE.width - PAGE.margin - timeWidth - 6 : PAGE.margin + timeWidth + 6;
    const contentRight = PAGE.width - PAGE.margin - timeWidth - 6;
    setColor(doc, 'setDrawColor', 'line');
    doc.line(PAGE.margin, y + layout.height, PAGE.width - PAGE.margin, y + layout.height);
    setColor(doc, 'setFillColor', 'pale');
    const timeX = rtl ? PAGE.width - PAGE.margin - timeWidth : PAGE.margin;
    doc.roundedRect(timeX, y + 2, timeWidth, 10, 2, 2, 'F');
    drawText(doc, safeText(item.time, '--:--'), timeX + timeWidth / 2, y + 4, { rtl: false, align: 'center', size: 8.5, color: 'blue' });
    const textX = rtl ? contentRight : contentX;
    let textY = y + 2;
    textY += drawLines(doc, layout.titleLines, textX, textY, { rtl, size: 10.5, color: 'ink', lineHeight: 4.5 });
    if (layout.descriptionLines.length) {
      drawLines(doc, layout.descriptionLines, textX, textY + 1, { rtl, size: 8.5, color: 'muted', lineHeight: 3.8 });
    }
    return y + layout.height;
  }

  async function createTripPdfBlob(options = {}) {
    const jsPDF = options.jsPDF || global.jspdf?.jsPDF;
    if (typeof jsPDF !== 'function') throw new Error('jsPDF is unavailable');
    const schedule = Array.isArray(options.schedule) ? options.schedule : [];
    if (!schedule.length) throw new Error('Schedule is empty');
    const language = options.language === 'en' ? 'en' : 'ar';
    const rtl = language === 'ar';
    const destination = safeText(options.destination, rtl ? 'تايلند' : 'Thailand');
    const fontBase64 = await loadArabicFont(options.fontData, options.fontUrl);
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true, putOnlyUsedFonts: true });
    doc.addFileToVFS('Amiri-Regular.ttf', fontBase64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri', 'normal');
    doc.setLanguage(rtl ? 'ar' : 'en-US');
    doc.setProperties({ title: `TravelTrip - ${destination}`, subject: rtl ? 'خطة الرحلة' : 'Trip itinerary', creator: 'TravelTrip' });

    addPageHeader(doc, destination, rtl, false);
    let y = 34;
    drawText(doc, rtl ? 'خطة الرحلة' : 'Trip itinerary', rtl ? PAGE.width - PAGE.margin : PAGE.margin, y, { rtl, size: 24, color: 'navy' });
    y += 13;
    drawText(doc, destination, rtl ? PAGE.width - PAGE.margin : PAGE.margin, y, { rtl, size: 15, color: 'violet' });
    y += 16;

    for (const day of schedule) {
      if (y + 31 > PAGE.height - PAGE.footer) y = addNewPage(doc, destination, rtl);
      y = drawDayHeading(doc, day, y, rtl);
      const items = Array.isArray(day.items) ? [...day.items].sort((a, b) => safeText(a.time).localeCompare(safeText(b.time))) : [];
      if (!items.length) {
        drawText(doc, rtl ? 'لا توجد أنشطة مضافة لهذا اليوم.' : 'No activities added for this day.', rtl ? PAGE.width - PAGE.margin : PAGE.margin, y + 2, { rtl, size: 9, color: 'muted' });
        y += 14;
        continue;
      }
      for (const item of items) {
        const layout = itemLayout(doc, item);
        if (y + layout.height > PAGE.height - PAGE.footer) {
          y = addNewPage(doc, destination, rtl);
          y = drawDayHeading(doc, day, y, rtl, true);
        }
        y = drawItem(doc, item, layout, y, rtl);
      }
      y += 6;
    }

    const pageCount = doc.getNumberOfPages();
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      doc.setPage(pageNumber);
      setColor(doc, 'setDrawColor', 'line');
      doc.line(PAGE.margin, 284, PAGE.width - PAGE.margin, 284);
      drawText(doc, 'TravelTrip • Thailand 2026', PAGE.margin, 287, { rtl: false, size: 8, color: 'muted' });
      drawText(doc, `${pageNumber} / ${pageCount}`, PAGE.width - PAGE.margin, 287, { rtl: false, align: 'right', size: 8, color: 'muted' });
    }

    const blob = doc.output('blob');
    if (!(blob instanceof Blob) || blob.size < 1000) throw new Error('Generated PDF is invalid');
    return blob;
  }

  const api = { createTripPdfBlob };
  global.TravelTripPdf = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
