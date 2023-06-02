// Libs
import { readFileSync } from "fs";

import { render } from "ejs";
import { Workbook } from "exceljs";
import mailer from "nodemailer";
import { Logger } from "winston";

import workerMessages from "../proto/worker_pb";

// Class
class MailerModel {
  private static mailCC = process.env.MAIL_CC!;
  private static mailUser = process.env.MAIL_USER!;
  private static mailPass = process.env.MAIL_PASS!;

  /**
   * A method to send via email the report.
   * @param logger - the logger object to track all the events.
   * @param report -The worker's report.
   * @param worker - The worker that has the name.
   */
  public static async send(
    logger: Logger,
    report: Workbook,
    worker: workerMessages.Worker
  ): Promise<boolean> {
    const workerName = `${worker.getFirstname()} ${worker.getLastname()}`;
    // Create the transport and send the message
    const transport = mailer.createTransport({
      service: "gmail",
      auth: {
        user: this.mailUser,
        pass: this.mailPass,
      },
    });
    try {
      await transport.sendMail({
        to: this.mailUser,
        subject: `Relatório de Ponto ${workerName} ${new Date().getMonth()}/${new Date().getFullYear()}`,
        cc: this.mailCC,
        html: render(
          readFileSync("./src/templates/report.ejs").toString("utf-8"),
          { worker }
        ),
        attachments: [
          {
            filename: `Relatório de Pontos ${workerName} - ${new Date().getMonth()}.${new Date().getFullYear()}.xlsx`,
            content: Buffer.from(await report.xlsx.writeBuffer()),
          },
        ],
      });
      return true;
    } catch (err) {
      logger.error("Couldn't send the report. " + err);
      return false;
    }
  }
}

// Code
export default MailerModel;
