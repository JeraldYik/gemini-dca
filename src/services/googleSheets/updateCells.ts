import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

import { logger } from "../../utils/logger";
import { startRow } from "./../../utils/config";

const updateCells = async (
  doc: GoogleSpreadsheet,
  sheetName: string,
  differenceInDays: number,
  values: (string | number)[]
) => {
  const targetedRowNumber = startRow + differenceInDays;

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

  const cellRangeString = `E${targetedRowNumber}:L${targetedRowNumber}`;
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

  const E_ASCII_CODE = 69;
  logger.info({
    message: "temporary logger for updating google sheets values",
    meta: {
      values,
    },
  });
  values.forEach((value, idx) => {
    const letter = String.fromCharCode(E_ASCII_CODE + idx);
    const cell = sheet.getCellByA1(`${letter}${targetedRowNumber}`);
    cell.value = value;
  });

  try {
    await sheet!.saveUpdatedCells();
    logger.info({
      message: "Successfully updated cells",
      meta: {
        cellRangeString,
        values,
      },
    });
  } catch (error) {
    logger.error({
      message: "Error while updating cells",
      meta: {
        cellRangeString,
      },
      error,
    });
  }
};

export default updateCells;
