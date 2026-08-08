const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function getResponseData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const responseSheet = spreadsheet
    .getSheets()
    .find((sheet) => sheet.getLastRow() > 1);

  if (!responseSheet) return { headers: [], rows: [] };

  const rows = responseSheet.getDataRange().getDisplayValues();
  return { headers: rows.shift() || [], rows };
}

function findYouTubeColumns(headers) {
  const columns = headers
    .map((header, index) => ({ header: String(header), index }))
    .filter(({ header }) => /youtube|動画.*(?:url|リンク)|(?:url|リンク).*動画/i.test(header))
    .map(({ index }) => index);

  return columns.length ? columns : headers.map((_, index) => index);
}

function extractYouTubeId(value) {
  const text = String(value || "").trim();
  const match = text.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#\s]*&)?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/i,
  );

  return match && YOUTUBE_ID_PATTERN.test(match[1]) ? match[1] : null;
}

function doGet() {
  const { headers, rows } = getResponseData();
  if (!rows.length) {
    return jsonResponse({ entries: [], updatedAt: new Date().toISOString() });
  }
  const candidateColumns = findYouTubeColumns(headers);
  const seen = new Set();
  const entries = [];

  rows.forEach((row) => {
    for (const columnIndex of candidateColumns) {
      const youtubeId = extractYouTubeId(row[columnIndex]);
      if (!youtubeId || seen.has(youtubeId)) continue;

      seen.add(youtubeId);
      entries.push({ youtubeId });
      break;
    }
  });

  return jsonResponse({ entries, updatedAt: new Date().toISOString() });
}

function doPost(event) {
  try {
    const payload = JSON.parse((event && event.postData && event.postData.contents) || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty(
      "ENTRY_LOOKUP_SECRET",
    );

    if (!expectedSecret || payload.secret !== expectedSecret || payload.action !== "lookupByEmail") {
      return jsonResponse({ success: false, error: "unauthorized" });
    }

    const email = normalizeEmail(payload.email);
    const { headers, rows } = getResponseData();
    const emailColumn = headers.findIndex((header) =>
      /メール|mail|e-mail/i.test(String(header)),
    );

    if (!email || emailColumn < 0) {
      return jsonResponse({ success: true, videoIds: [] });
    }

    const youtubeColumns = findYouTubeColumns(headers);
    const seen = new Set();
    const videoIds = [];

    rows.forEach((row) => {
      if (normalizeEmail(row[emailColumn]) !== email) return;

      for (const columnIndex of youtubeColumns) {
        const youtubeId = extractYouTubeId(row[columnIndex]);
        if (!youtubeId || seen.has(youtubeId)) continue;
        seen.add(youtubeId);
        videoIds.push(youtubeId);
        break;
      }
    });

    return jsonResponse({ success: true, videoIds });
  } catch (error) {
    return jsonResponse({ success: false, error: "invalid_request" });
  }
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
