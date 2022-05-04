import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

import { expect } from "chai";
import { googleSheetName } from "./../../../src/utils/config";
import { initialiseGoogleDocument } from "../../../src/setup/googleSheets";
import updateCells from "../../../src/services/googleSheets/updateCells";

describe("UNIT TEST: Update Cells on Google Sheets", async () => {
  const ALL_VALUES = [
    [new Date().toLocaleDateString(), 10, 50000, 0.0002],
    [new Date().toLocaleDateString(), 20, 4000, 0.005],
  ];
  const CELL_RANGES = ["E4:H4", "I4:L4"];
  let doc: GoogleSpreadsheet;
  let sheet: GoogleSpreadsheetWorksheet;
  let writtenValues: string[] = [];

  before(async () => {
    doc = await initialiseGoogleDocument();
    sheet = await doc.sheetsByTitle[googleSheetName];
  });

  // How the google-spreadsheet library is written is such that '' is trimmed from headerValues, as such only columns A-I are considered
  // This results in the rightmost columns (columns J-L) being missing in the instantiated object
  // Columns A-D is unwanted in our operations, as such we discard it
  it("Should successfully update cells", async () => {
    for (let i = 0; i < ALL_VALUES.length; i++) {
      const values = ALL_VALUES[i];
      await updateCells(doc, googleSheetName, CELL_RANGES[i], values);
      const row = (await sheet.getRows({ offset: 2, limit: 1 }))[0];
      const trimmedRow: string[] = row._rawData.slice(4 * (i + 1), 4 * (i + 2));
      writtenValues = [...writtenValues, ...trimmedRow];
    }
    writtenValues.forEach((cell: string, idx: number) => {
      const parsedCell = idx % 4 != 0 ? parseFloat(cell) : cell;
      expect(parsedCell).to.be.eql(ALL_VALUES[Math.floor(idx / 4)][idx % 4]);
    });
  });

  after(async () => {
    await sheet.loadCells("E4:L4");
    const E_ASCII_CODE = 69;
    for (let i = 0; i < 8; i++) {
      const letter = String.fromCharCode(E_ASCII_CODE + i);
      const cell = sheet.getCellByA1(`${letter}4`);
      cell.value = "";
    }
    await sheet.saveUpdatedCells();
  });
});
