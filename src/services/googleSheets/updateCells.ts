import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

import { logger } from "../../utils/logger";

const updateCells = async (
  doc: GoogleSpreadsheet,
  sheetName: string,
  differenceInDays: number,
  values: (string | number)[]
) => {
  // DO NOT TOUCH THIS
  const FIRST_ROW_NUMBER = 4;
  const targetedRowNumber = FIRST_ROW_NUMBER + differenceInDays;

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

  const cellRangeString = `A${targetedRowNumber}:H${targetedRowNumber}`;
  try {
    await sheet!.loadCells(cellRangeString);
  } catch (error) {
    logger.error({
      message: "Error while loading cells",
      meta: {
        cellRangeString,
      },
      error,
    });
  }

  const A_ASCII_CODE = 65;
  values.forEach((value, idx) => {
    const letter = String.fromCharCode(A_ASCII_CODE + idx);
    const cell = sheet.getCellByA1(`${letter}${targetedRowNumber}`);
    cell.value = value;
  });

  try {
    await sheet!.saveUpdatedCells();
  } catch (error) {
    logger.error({
      message: "Error while updating cells",
      meta: {
        cellRangeString,
      },
      error,
    });
  }

  logger.info({
    message: "Successfully updated cells",
    meta: {
      cellRangeString,
    },
  });
};

export default updateCells;
