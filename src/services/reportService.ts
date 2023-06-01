// Libs
import { Logger } from "winston";

import messages from "../proto/cardchecker_pb";

import CardcheckerModel from "../models/cardcheckerModel";
import LoggerModel from "../models/loggerModel";

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
    console.info(checks.toObject().dataList);
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
    const month = Number(process.env.MONTH_TARGET!);
    const dateInit = new Date(new Date().getFullYear(), month, 1);
    const dateEnd = new Date(new Date().getFullYear(), month + 1, 0);

    // Get the checks.
    return CardcheckerModel.getRange(logger, cardId, dateInit, dateEnd);
  }
}

// Code
export default ReportService;
