// ─── Shipt Audit Matrix — Google Apps Script Backend ───────────
// 1. Create a Google Sheet. Add a tab named "audit" (lowercase).
// 2. Open Extensions → Apps Script, paste this file, save.
// 3. Click Deploy → New deployment → Web App.
//    - Execute as: Me
//    - Who has access: Anyone (or Anyone within your org)
// 4. Copy the Web App URL and paste it into SHEET_URL in App.tsx.

const SHEET_NAME = "audit";
// Set this to any strong random string. Must match REACT_APP_SHEET_TOKEN in .env
const AUTH_TOKEN = "REPLACE_WITH_A_STRONG_SECRET";

function doGet(e) {
  if (e.parameter.token !== AUTH_TOKEN) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sheet.getLastRow() > 0 ? sheet.getDataRange().getValues() : [];

  const result = {};
  values.forEach(([surfId, dimId, score, note]) => {
    if (!surfId || !dimId) return;
    if (!result[surfId]) result[surfId] = {};
    result[surfId][dimId] = {
      score: score === "" || score === null ? null : Number(score),
      note: note || "",
    };
  });

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.token !== AUTH_TOKEN) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const { surfId, dimId, score, note } = body;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  const lastRow = sheet.getLastRow();
  const values = lastRow > 0 ? sheet.getDataRange().getValues() : [];

  let rowIndex = -1;
  values.forEach(([s, d], i) => {
    if (s === surfId && d === dimId) rowIndex = i + 1;
  });

  if (rowIndex === -1) {
    sheet.appendRow([
      surfId,
      dimId,
      score === null || score === undefined ? "" : score,
      note !== undefined ? note : "",
    ]);
  } else {
    if (score !== undefined) {
      sheet.getRange(rowIndex, 3).setValue(score === null ? "" : score);
    }
    if (note !== undefined) {
      sheet.getRange(rowIndex, 4).setValue(note);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON
  );
}
