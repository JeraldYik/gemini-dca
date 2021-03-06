import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

import { logger } from "../../utils/logger";

const updateCells = async (
  doc: GoogleSpreadsheet,
  sheetName: string,
  cellRange: string,
  values: (string | number)[]
) => {
  let sheet: GoogleSpreadsheetWorksheet;
  try {
    sheet = await doc.sheetsByTitle[sheetName];
  } catch (error) {
    logger.error({
      message: "Error while retrieving Google sheet",
      meta: {
        sheetName,
      },
      error,
    });
  }

  try {
    await sheet!.loadCells(cellRange);
  } catch (error) {
    logger.error({
      message: "Error while loading cells",
      meta: {
        cellRange,
      },
      error,
    });
  }

  // Assume that starting letter is only 1 char
  const STARTING_LETTER_ASCII_CODE = cellRange[0].charCodeAt(0);
  // to account for multi-digit row number
  const targetedRowNumber = cellRange.slice(1).split(":")[0];
  values.forEach((value, idx) => {
    const letter = String.fromCharCode(STARTING_LETTER_ASCII_CODE + idx);
    const cell = sheet.getCellByA1(`${letter}${targetedRowNumber}`);
    cell.value = value;
  });

  try {
    await sheet!.saveUpdatedCells();
    logger.info({
      message: "Successfully updated cells",
      meta: {
        cellRange,
        values,
      },
    });
  } catch (error) {
    logger.error({
      message: "Error while updating cells",
      meta: {
        cellRange,
      },
      error,
    });
  }
};

export default updateCells;
