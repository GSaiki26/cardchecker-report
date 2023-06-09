// Libs
import ReportService from "./services/reportService";

// Code
const cardsIds = process.env.CARDS_IDS!.split(";");
for (const cardId of cardsIds) {
  ReportService.doReportCycle(cardId);
}
