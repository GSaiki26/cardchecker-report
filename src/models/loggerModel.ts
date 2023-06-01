// Libs
import { createLogger, format, Logger, transports } from "winston";

// Data
const { colorize, combine, printf, timestamp } = format;

// Class
class LoggerModel {
  /**
   * A method to create a logger.
   * @param owner - The logger's owner. Will be used to describe the owner's report.
   */
  public static createLogger(owner: string): Logger {
    const loggerOwner = `Report #${process.pid}|${owner}`;
    return createLogger({
      transports: [new transports.Console()],
      format: combine(
        colorize(),
        timestamp(),
        printf(
          (info) =>
            `[${info.timestamp}] (${loggerOwner}) ${info.level} - ${info.message}`
        )
      ),
    });
  }
}

// Code
export default LoggerModel;
