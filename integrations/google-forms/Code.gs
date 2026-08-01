/**
 * Googleフォームの回答先スプレッドシートに紐づけて使用します。
 * 回答中のYouTube URLだけを抽出し、個人情報を含まないJSONを返します。
 */

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function extractYouTubeId(value) {
  const text = String(value || "").trim();
  const match = text.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#\s]*&)?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/i,
  );

  return match && YOUTUBE_ID_PATTERN.test(match[1]) ? match[1] : null;
}

function doGet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const responseSheet = spreadsheet
    .getSheets()
    .find((sheet) => sheet.getLastRow() > 1);

  if (!responseSheet) {
    return jsonResponse({ entries: [], updatedAt: new Date().toISOString() });
  }

  const rows = responseSheet.getDataRange().getDisplayValues();
  const headers = rows.shift() || [];
  const youtubeColumns = headers
    .map((header, index) => ({ header: String(header), index }))
    .filter(({ header }) => /youtube|動画.*(?:url|リンク)|(?:url|リンク).*動画/i.test(header))
    .map(({ index }) => index);
  const candidateColumns = youtubeColumns.length
    ? youtubeColumns
    : headers.map((_, index) => index);
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

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
