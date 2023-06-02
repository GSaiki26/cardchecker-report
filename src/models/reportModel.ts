// Libs
import { Table, Workbook, Worksheet } from "exceljs";
import { Logger } from "winston";

import messages from "../proto/cardchecker_pb";

// Types
interface ChecksByDay {
  [key: number]: string[];
}

// Class
class ReportModel {
  /**
   * A method to create a Workbook
   * @param logger - The logger obj to track the events.
   * @param checks - The GetRange Response to add all checks to the table.
   */
  public static createReport(
    logger: Logger,
    checks: messages.GetRangeRes
  ): Workbook {
    // Create the worksheet.
    const date = `${Number(process.env.TARGET_MONTH) + 1}-${
      process.env.TARGET_YEAR
    }`;
    const wb = new Workbook();
    const ws = wb.addWorksheet("Controle de Pontos " + date);

    // Create the table.
    logger.info("Creating the table...");
    ws.addRow([
      "Data",
      "Dia da Semana",
      "Entrada",
      "Entrada Almoço",
      "Saída Almoço",
      "Saída",
      "Total do Dia",
    ]);

    // Add the checks to the table.
    this.addChecksRowsToWorksheet(logger, ws, checks.toObject().dataList);
    this.formatTable(ws);

    return wb;
  }

  /**
   * A method to add the checks in rows inside the provided worksheet.
   * @param logger - The logger object to track the events.
   * @param ws - The worksheet to be edited.
   * @param checks - The checks to be added to the table.
   */
  public static addChecksRowsToWorksheet(
    logger: Logger,
    ws: Worksheet,
    checks: messages.Check.AsObject[]
  ): void {
    logger.info("Adding the checks in the table.");
    // Create the time range.
    const month = Number(process.env.TARGET_MONTH!) - 1;
    const year = Number(process.env.TARGET_YEAR!);
    const monthDate = new Date(year, month, 1);

    // Add the rows by day from the month.
    const checksByDay = this.splitChecksByDay(checks);
    while (monthDate.getMonth() == month) {
      // Add the checks from the day.
      const dayDate = new Date(monthDate.getTime());
      const row: (string | Date)[] = [dayDate, dayDate];
      if (checksByDay[monthDate.getDate()])
        row.push(...checksByDay[monthDate.getDate()]);

      // Add empty times if row length isn\'t enough.
      while (row.length < 6) {
        row.push(
          `${dayDate.getHours()}:${dayDate.getMinutes()}:${dayDate.getSeconds()}`
        );
      }

      // Add the row into the excel file.
      ws.addRow(row);

      // Add the formula.
      const rowI = monthDate.getDate() + 1;
      ws.getCell(`G${rowI}`).value = {
        formula: `F${rowI} - C${rowI} - ( E${rowI} - D${rowI} )`,
        date1904: false,
      };

      monthDate.setDate(monthDate.getDate() + 1);
    }
  }

  /**
   * A method to treat the checks by day, using a array of checks.
   * @param checks - The array of checks to be used to create the checks by Day.
   */
  private static splitChecksByDay(
    checks: messages.Check.AsObject[]
  ): ChecksByDay {
    const checksByDay: ChecksByDay = {};
    for (const check of checks) {
      const date = new Date(check.checktime);
      date.setMinutes(-date.getTimezoneOffset());
      if (!(date.getDate() in checksByDay)) checksByDay[date.getDate()] = [];
      checksByDay[date.getDate()].push(
        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      );
    }

    return checksByDay;
  }

  /**
   * A method to format the table.
   * @param table - The table to format his rows.
   */
  private static formatTable(ws: Worksheet): void {
    ws.getColumn(`A`).numFmt = "dd/mm/yyyy";
    ws.getColumn(`B`).numFmt = "dddd";
    for (let i = 0; i < 5; i++) {
      ws.getColumn(i + 3).numFmt = "hh:mm:ss";
    }
  }
}

// Code
export default ReportModel;
