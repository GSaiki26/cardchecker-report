// Libs
import { Logger } from "winston";

import messages from "../proto/cardchecker_pb";

import CardcheckerModel from "../models/cardcheckerModel";
import LoggerModel from "../models/loggerModel";
import ReportModel from "../models/reportModel";

// Class
class ReportService {
  /**
   * A method to create a report.
   * @param cardId - The worker's card id to create the report.
   */
  public static async createReport(cardId: string): Promise<void> {
    const logger = LoggerModel.createLogger(cardId);
    logger.info("Creating report from cardId #" + cardId);

    // Get the montly checks.
    const checks = await this.getMonthlyChecks(logger, cardId);
    if (!checks) return;

    // Create the report.
    const report = ReportModel.createReport(logger, checks);
    if (!report) return;
  }

  /**
   * A method to get the monthly checks from the cardchecker api.
   * @param logger - The logger object to describe the events.
   * @param cardId - The card id to be searched in the cardchecker api.
   */
  public static getMonthlyChecks(
    logger: Logger,
    cardId: string
  ): Promise<messages.GetRangeRes | null> {
    logger.info("Getting monthly checks...");

    // Create the time range.
    const month = Number(process.env.TARGET_MONTH!) - 1;
    const year = Number(process.env.TARGET_YEAR!);

    const dateInit = new Date(year, month, 1);
    const dateEnd = new Date(year, month + 1, 0);

    // Get the checks.
    return CardcheckerModel.getRange(logger, cardId, dateInit, dateEnd);
  }
}

// Code
export default ReportService;
