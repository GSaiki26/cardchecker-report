// Libs
import { readFileSync } from "fs";

import * as grpc from "@grpc/grpc-js";

import messages from "../proto/cardchecker_pb";
import services from "../proto/cardchecker_grpc_pb";
import { Logger } from "winston";

// Class
class CardcheckerModel {
  private static creds = grpc.ChannelCredentials.createSsl(
    readFileSync("./certs/ca.pem"),
    readFileSync("./certs/report.pem.key"),
    readFileSync("./certs/report.pem")
  );
  private static client = new services.CardCheckerServiceClient(
    process.env.CARDCHECKER_API_URI!,
    this.creds
  );

  /**
   * A method to get all the checks in a range of dates.
   * @param logger - The logger param to log all events.
   * @param cardId - The worker's cardId to search all his checks.
   * @param dateInit - The date to start the range.
   * @param dateEnd - The date to set the end of the range.
   */
  public static getRange(
    logger: Logger,
    cardId: string,
    dateInit: Date,
    dateEnd: Date
  ): Promise<messages.GetRangeRes | null> {
    const reqBody = new messages.GetRangeReq()
      .setCardid(cardId)
      .setDateinit(dateInit.toISOString())
      .setDateend(dateEnd.toISOString());

    return new Promise((resolve) => {
      CardcheckerModel.client.getRange(reqBody, (err, res) => {
        if (err) {
          logger.error("Couldn't get the checks. " + err);
          return resolve(null);
        }
        resolve(res);
      });
    });
  }
}

// Code
export default CardcheckerModel;
