import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

import { expect } from "chai";
import { googleSheetName } from "./../../../src/utils/config";
import { initialiseGoogleDocument } from "../../../src/utils/setup";
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
      expect(idx % 4 === 0 ? cell : parseFloat(cell)).to.be.eql(VALUES[idx]);
    });
  });

  after(async () => {
    await sheet.loadCells("E4:L4");
    const A_ASCII_CODE = 65;
    VALUES.forEach((_, idx) => {
      const letter = String.fromCharCode(A_ASCII_CODE + idx);
      const cell = sheet.getCellByA1(`${letter}4`);
      cell.value = "";
    });
    await sheet.saveUpdatedCells();
  });
});
