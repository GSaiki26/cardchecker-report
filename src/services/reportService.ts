// Libs
import { Logger } from "winston";

import messages from "../proto/cardchecker_pb";

import CardcheckerModel from "../models/cardcheckerModel";
import LoggerModel from "../models/loggerModel";
import MailerModel from "../models/mailerModel";
import ReportModel from "../models/reportModel";
import WorkerModel from "../models/workerModel";

// Class
class ReportService {
  /**
   * A method to create and send a report.
   * @param cardId - The worker's card id to create the report.
   */
  public static async doReportCycle(cardId: string): Promise<void> {
    const logger = LoggerModel.createLogger(cardId);
    logger.info("Creating report from cardId #" + cardId);

    // Get the worker.
    const worker = await WorkerModel.getWorkerByCardId(logger, cardId);
    if (!worker) return;

    // Get the montly checks.
    const checks = await this.getMonthlyChecks(logger, cardId);
    if (!checks) return;

    // Create the report.
    const report = ReportModel.createReport(logger, checks);
    if (!report) return;

    // Send the report.
    const sended = await MailerModel.send(logger, report, worker.getData()!);
    if (!sended) return;

    logger.info("The report cycle was finished.");
  }

  /**
   * A method to get the monthly checks from the cardchecker api.
   * @param logger - The logger object to describe the events.
   * @param cardId - The card id to be searched in the cardchecker api.
   */
  private static getMonthlyChecks(
    logger: Logger,
    cardId: string
  ): Promise<messages.GetRangeRes | null> {
    logger.info("Getting monthly checks...");

    // Create the time range.
    const dateInit = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    );
    const dateEnd = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    dateEnd.setMinutes(-1);

    // Get the checks.
    return CardcheckerModel.getRange(logger, cardId, dateInit, dateEnd);
  }
}

// Code
export default ReportService;
