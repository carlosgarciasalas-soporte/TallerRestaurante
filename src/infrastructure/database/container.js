const { createUser } = require("../../domain/entities/User");
const { createCategory } = require("../../domain/entities/Category");
const { createProduct } = require("../../domain/entities/Product");
const { createOrder } = require("../../domain/entities/Order");
const { createPayment } = require("../../domain/entities/Payment");
const { createReservation } = require("../../domain/entities/Reservation");
const { InMemoryRepository } = require("../repositories/InMemoryRepository");
const { CrudService } = require("../../application/use-cases/CrudService");
const { AuthService } = require("../../application/use-cases/AuthService");
const { OrderService } = require("../../application/use-cases/OrderService");
const { PaymentService } = require("../../application/use-cases/PaymentService");
const { ReportService } = require("../../application/use-cases/ReportService");
const { DashboardService } = require("../../application/use-cases/DashboardService");
const { seedData } = require("./seedData");

function createContainer({ seed = true } = {}) {
  const repositories = {
    users: new InMemoryRepository(),
    categories: new InMemoryRepository(),
    products: new InMemoryRepository(),
    orders: new InMemoryRepository(),
    reservations: new InMemoryRepository(),
    payments: new InMemoryRepository()
  };

  const orderService = new OrderService(repositories.orders, repositories.products, repositories.users);
  const reportService = new ReportService(repositories.orders, repositories.payments, repositories.products);

  const services = {
    auth: new AuthService(repositories.users),
    users: new CrudService(repositories.users, createUser, "Usuario"),
    categories: new CrudService(repositories.categories, createCategory, "Categoria"),
    products: new CrudService(repositories.products, createProduct, "Producto"),
    reservations: new CrudService(repositories.reservations, createReservation, "Reserva"),
    orders: orderService,
    payments: new PaymentService(repositories.payments, repositories.orders),
    reports: reportService,
    dashboard: new DashboardService(repositories, reportService, orderService)
  };

  if (seed) {
    seedContainer(repositories);
  }

  return { repositories, services };
}

function seedContainer(repositories) {
  repositories.users.clear();
  repositories.categories.clear();
  repositories.products.clear();
  repositories.orders.clear();
  repositories.reservations.clear();
  repositories.payments.clear();

  seedData.users.forEach((item) => repositories.users.create(createUser(item)));
  seedData.categories.forEach((item) => repositories.categories.create(createCategory(item)));
  seedData.products.forEach((item) => repositories.products.create(createProduct(item)));
  seedData.orders.forEach((item) => repositories.orders.create(createOrder(item)));
  seedData.payments.forEach((item) => repositories.payments.create(createPayment(item)));
  seedData.reservations.forEach((item) => repositories.reservations.create(createReservation(item)));
}

module.exports = { createContainer, seedContainer };
