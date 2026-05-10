class DashboardService {
  constructor(repositories, reportService, orderService) {
    this.repositories = repositories;
    this.reportService = reportService;
    this.orderService = orderService;
  }

  summary() {
    const orders = this.repositories.orders.all();
    const products = this.repositories.products.all();
    const customers = this.repositories.users.all().filter((user) => user.role === "cliente");
    const dailySales = this.reportService.dailySales();

    return {
      products: products.length,
      customers: customers.length,
      activeOrders: orders.filter((order) => !["pagado", "cancelado"].includes(order.status)).length,
      dailySales: dailySales.totalSales,
      reservations: this.repositories.reservations.all().length,
      availableProducts: products.filter((product) => product.available !== false).length
    };
  }

  recentOrders(limit = 5) {
    return this.repositories.orders
      .all()
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, Number(limit) || 5)
      .map((order) => this.orderService.enrich(order));
  }
}

module.exports = { DashboardService };
