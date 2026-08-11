const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const LOOKUP_RATE_LIMIT_SECONDS = 60;
const LOOKUP_RATE_LIMIT_MAX_REQUESTS = 5;

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function constantTimeEquals(left, right) {
  const leftBytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(left),
  );
  const rightBytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(right),
  );
  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }
  return difference === 0;
}

function consumeLookupRateLimit(email) {
  const emailHash = Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email),
  );
  const cache = CacheService.getScriptCache();
  const key = `lookup-rate:${emailHash}`;
  const count = Number(cache.get(key) || "0") + 1;
  cache.put(key, String(count), LOOKUP_RATE_LIMIT_SECONDS);
  return count <= LOOKUP_RATE_LIMIT_MAX_REQUESTS;
}

function getResponseData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const responseSheet = spreadsheet
    .getSheets()
    .find((sheet) => sheet.getLastRow() > 1);

  if (!responseSheet) return { headers: [], rows: [] };

  const rows = responseSheet.getDataRange().getValues();
  return { headers: rows.shift() || [], rows };
}

function findTimestampColumn(headers) {
  const detected = headers.findIndex((header) =>
    /タイムスタンプ|timestamp|送信日時|回答日時/i.test(String(header)),
  );
  return detected >= 0 ? detected : 0;
}

function toIsoTimestamp(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  const timestamp = Date.parse(String(value || ""));
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function addYouTubeViewCounts(entries) {
  try {
    const counts = new Map();
    for (let offset = 0; offset < entries.length; offset += 50) {
      const batch = entries.slice(offset, offset + 50);
      const response = YouTube.Videos.list("statistics", {
        id: batch.map((entry) => entry.youtubeId).join(","),
      });
      (response.items || []).forEach((video) => {
        const viewCount = Number(video.statistics && video.statistics.viewCount);
        if (Number.isSafeInteger(viewCount) && viewCount >= 0) {
          counts.set(video.id, viewCount);
        }
      });
    }
    return entries.map((entry) => ({
      ...entry,
      ...(counts.has(entry.youtubeId)
        ? { viewCount: counts.get(entry.youtubeId) }
        : {}),
    }));
  } catch (error) {
    console.warn("YouTube statistics could not be loaded", error);
    return entries;
  }
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
  const timestampColumn = findTimestampColumn(headers);
  const seen = new Set();
  const entries = [];

  rows.forEach((row) => {
    for (const columnIndex of candidateColumns) {
      const youtubeId = extractYouTubeId(row[columnIndex]);
      if (!youtubeId || seen.has(youtubeId)) continue;

      seen.add(youtubeId);
      const submittedAt = toIsoTimestamp(row[timestampColumn]);
      entries.push({ youtubeId, ...(submittedAt ? { submittedAt } : {}) });
      break;
    }
  });

  return jsonResponse({
    entries: addYouTubeViewCounts(entries),
    updatedAt: new Date().toISOString(),
  });
}

function doPost(event) {
  try {
    const payload = JSON.parse((event && event.postData && event.postData.contents) || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty(
      "ENTRY_LOOKUP_SECRET",
    );

    if (
      !expectedSecret ||
      !constantTimeEquals(String(payload.secret || ""), expectedSecret) ||
      payload.action !== "lookupByEmail"
    ) {
      return jsonResponse({ success: false, error: "unauthorized" });
    }

    const email = normalizeEmail(payload.email);
    if (!email || !consumeLookupRateLimit(email)) {
      return jsonResponse({ success: false, error: "rate_limited" });
    }
    const { headers, rows } = getResponseData();
    const emailColumn = headers.findIndex((header) =>
      /メール|mail|e-mail/i.test(String(header)),
    );

    if (emailColumn < 0) {
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
