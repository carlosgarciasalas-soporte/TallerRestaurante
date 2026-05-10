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

  analytics() {
    const orders = this.repositories.orders.all();
    const products = this.repositories.products.all();
    const categories = this.repositories.categories.all();
    const customers = this.repositories.users.all().filter((user) => user.role === "cliente");
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const expenses = Math.round(revenue * 0.42);

    return {
      totals: {
        orders: orders.length,
        customers: customers.length,
        revenue,
        revenueToday: this.reportService.dailySales().totalSales
      },
      revenueSeries: [
        { label: "Mar", income: 9200, expense: 5200 },
        { label: "Apr", income: 10400, expense: 6100 },
        { label: "May", income: 9600, expense: 5800 },
        { label: "Jun", income: 11800, expense: 7000 },
        { label: "Jul", income: 16800, expense: 8200 },
        { label: "Aug", income: 11200, expense: 5400 },
        { label: "Sep", income: 14600, expense: 7600 },
        { label: "Oct", income: 18400, expense: 9200 }
      ],
      ordersOverview: [
        { label: "Mon", orders: 128 },
        { label: "Tue", orders: 142 },
        { label: "Wed", orders: 168 },
        { label: "Thu", orders: 185 },
        { label: "Fri", orders: 174 },
        { label: "Sat", orders: 158 },
        { label: "Sun", orders: 162 }
      ],
      topCategories: categories.map((category) => {
        const categoryProducts = products.filter((product) => product.categoryId === category.id);
        const sold = orders.reduce((sum, order) => {
          const quantity = order.items
            .filter((item) => categoryProducts.some((product) => product.id === item.productId))
            .reduce((itemSum, item) => itemSum + item.quantity, 0);
          return sum + quantity;
        }, 0);
        return { name: category.name, value: sold };
      }),
      orderTypes: [
        { name: "Dine-in", value: Math.max(orders.filter((order) => order.tableNumber).length, 1), amount: revenue },
        { name: "Takeaway", value: 3, amount: Math.round(revenue * 0.34) },
        { name: "Online", value: 5, amount: Math.round(revenue * 0.46) }
      ],
      recentActivity: [
        { title: "Inventario actualizado", description: "Se ajustaron existencias de Organic Chicken Breast.", time: "11:20 AM" },
        { title: "Pedido completado", description: "El pedido #5 fue marcado como pagado.", time: "10:00 AM" },
        { title: "Nueva reserva", description: "Mesa para 6 personas confirmada para el 13/05.", time: "09:35 AM" }
      ],
      reviews: [
        { customer: "Sarah M.", title: "Classic Italian Penne", rating: 5, text: "Servicio rapido y presentacion impecable.", imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500&q=80" },
        { customer: "Michael R.", title: "Smoky Supreme Pizza", rating: 4.5, text: "Excelente sabor y buena temperatura.", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" }
      ],
      trendingMenus: this.repositories.orders
        .all()
        .flatMap((order) => order.items)
        .reduce((acc, item) => {
          acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
          return acc;
        }, {}),
      expenses
    };
  }
}

module.exports = { DashboardService };
