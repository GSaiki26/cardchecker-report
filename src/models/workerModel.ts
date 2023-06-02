// Libs
import { readFileSync } from "fs";

import * as grpc from "@grpc/grpc-js";
import { Logger } from "winston";

import messages from "../proto/worker_pb";
import services from "../proto/worker_grpc_pb";

// Class
class WorkerModel {
  private static creds = grpc.ChannelCredentials.createSsl(
    readFileSync("./certs/ca.pem"),
    readFileSync("./certs/report.pem.key"),
    readFileSync("./certs/report.pem")
  );
  private static client = new services.WorkerServiceClient(
    process.env.WORKER_API_URI!,
    this.creds
  );

  /**
   * A method to get some worker by his card id.
   * @param logger - The logger param to log all events.
   * @param cardId - The worker's card Id..
   */
  public static getWorkerByCardId(
    logger: Logger,
    cardId: string
  ): Promise<messages.DefaultRes | null> {
    logger.info("Getting the worker by card id.");
    const reqBody = new messages.GetByCardIdReq().setCardid(cardId);

    return new Promise((resolve) => {
      WorkerModel.client.getByCardId(reqBody, (err, res) => {
        if (err) {
          logger.error("Couldn't get the worker. " + err);
          return resolve(null);
        }
        resolve(res);
      });
    });
  }
}

// Code
export default WorkerModel;
