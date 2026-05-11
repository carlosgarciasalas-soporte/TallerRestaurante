const { createCashRegisterClose } = require("../../domain/entities/CashRegisterClose");
const { AppError } = require("../../shared/errors/AppError");
const { getPagination } = require("../../shared/pagination/paginate");

class CashRegisterService {
  constructor(closeRepository, reportService) {
    this.closeRepository = closeRepository;
    this.reportService = reportService;
  }

  dailySummary(date) {
    return this.reportService.dailySales(date);
  }

  listClosures(query) {
    return this.closeRepository.findAll(getPagination(query));
  }

  close(date = new Date().toISOString().slice(0, 10)) {
    const currentDate = date || new Date().toISOString().slice(0, 10);
    const existing = this.closeRepository.findBy("date", currentDate);

    if (existing) {
      throw new AppError("La caja ya fue cerrada para esta fecha.", 400);
    }

    const summary = this.dailySummary(currentDate);
    const closeRecord = createCashRegisterClose({
      date: currentDate,
      totalSales: summary.totalSales,
      paymentsCount: summary.paymentsCount,
      payments: summary.payments
    });

    return this.closeRepository.create(closeRecord);
  }
}

module.exports = { CashRegisterService };
