class ReportService {
  constructor(orderRepository, paymentRepository, productRepository) {
    this.orderRepository = orderRepository;
    this.paymentRepository = paymentRepository;
    this.productRepository = productRepository;
  }

  dailySales(date = new Date().toISOString().slice(0, 10)) {
    const payments = this.paymentRepository
      .all()
      .filter((payment) => payment.paidAt.slice(0, 10) === date);

    return {
      date,
      totalSales: payments.reduce((sum, payment) => sum + payment.amount, 0),
      paymentsCount: payments.length,
      payments
    };
  }

  ordersByStatus() {
    return this.orderRepository.all().reduce((summary, order) => {
      summary[order.status] = (summary[order.status] || 0) + 1;
      return summary;
    }, {});
  }

  topProducts() {
    const totals = {};
    this.orderRepository.all().forEach((order) => {
      order.items.forEach((item) => {
        totals[item.productId] = (totals[item.productId] || 0) + item.quantity;
      });
    });

    return Object.entries(totals)
      .map(([productId, quantity]) => ({
        product: this.productRepository.findById(productId),
        quantity
      }))
      .sort((a, b) => b.quantity - a.quantity);
  }
}

module.exports = { ReportService };
