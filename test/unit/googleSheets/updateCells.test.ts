import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { googleSheetName, startRow } from "./../../../src/utils/config";

import { expect } from "chai";
import { initialiseGoogleDocument } from "../../../src/setup/googleSheets";
import updateCells from "../../../src/services/googleSheets/updateCells";

describe("UNIT TEST: Update Cells on Google Sheets", async () => {
  const VALUES = [
    new Date().toLocaleDateString(),
    10,
    50000,
    0.0002,
    new Date().toLocaleDateString(),
    20,
    4000,
    0.005,
  ];
  let doc: GoogleSpreadsheet;
  let sheet: GoogleSpreadsheetWorksheet;

  before(async () => {
    doc = await initialiseGoogleDocument();
    sheet = await doc.sheetsByTitle[googleSheetName];
  });

  it("Should successfully update cells", async () => {
    await updateCells(doc, googleSheetName, 0, VALUES);
    const row = (
      await sheet.getRows({
        offset: 2,
        limit: 1,
      })
    )[0];

    row._rawData.forEach((cell: string, idx: number) => {
      // skip the first 4 cells
      if (idx < 4) return;
      expect(idx % 4 === 0 ? cell : parseFloat(cell)).to.be.eql(
        VALUES[idx - 4]
      );
    });
  });

  after(async () => {
    await sheet.loadCells("E4:L4");
    const E_ASCII_CODE = 69;
    VALUES.forEach((_, idx) => {
      const letter = String.fromCharCode(E_ASCII_CODE + idx);
      const cell = sheet.getCellByA1(`${letter}${startRow}`);
      cell.value = "";
    });
    await sheet.saveUpdatedCells();
  });
});
