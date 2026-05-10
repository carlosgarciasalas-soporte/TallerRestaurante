const { Router } = require("express");
const { createCrudRouter } = require("./crudRoutes");
const { asyncHandler } = require("../middlewares/asyncHandler");
const { validateRequired } = require("../middlewares/validateRequired");

function createApiRouter(services) {
  const router = Router();

  router.get("/health", (req, res) => {
    res.json({
      status: "ok",
      service: "SIGR Linea Base API",
      version: "1.0.0"
    });
  });

  router.post(
    "/auth/login",
    validateRequired(["email", "password"]),
    asyncHandler(async (req, res) => {
      res.json(services.auth.login(req.body));
    })
  );

  router.use("/users", createCrudRouter(services.users, ["name", "email", "password", "role"]));
  router.use("/categories", createCrudRouter(services.categories, ["name"]));
  router.use("/products", createCrudRouter(services.products, ["categoryId", "name", "price"]));
  router.use("/reservations", createCrudRouter(services.reservations, ["customerName", "phone", "date", "time", "people"]));

  router.get("/orders", asyncHandler(async (req, res) => {
    res.json(services.orders.list(req.query));
  }));

  router.post("/orders", validateRequired(["customerId", "items"]), asyncHandler(async (req, res) => {
    res.status(201).json(services.orders.create(req.body));
  }));

  router.get("/orders/:id", asyncHandler(async (req, res) => {
    res.json(services.orders.get(req.params.id));
  }));

  router.put("/orders/:id/status", validateRequired(["status"]), asyncHandler(async (req, res) => {
    res.json(services.orders.updateStatus(req.params.id, req.body.status));
  }));

  router.delete("/orders/:id", asyncHandler(async (req, res) => {
    res.json(services.orders.delete(req.params.id));
  }));

  router.post("/payments", validateRequired(["orderId", "amount"]), asyncHandler(async (req, res) => {
    res.status(201).json(services.payments.create(req.body));
  }));

  router.get("/cash-register/daily-summary", asyncHandler(async (req, res) => {
    res.json(services.reports.dailySales(req.query.date));
  }));

  router.post("/cash-register/close", asyncHandler(async (req, res) => {
    res.json({
      closed: true,
      summary: services.reports.dailySales(req.body.date)
    });
  }));

  router.get("/reports/daily-sales", asyncHandler(async (req, res) => {
    res.json(services.reports.dailySales(req.query.date));
  }));

  router.get("/reports/orders-by-status", asyncHandler(async (req, res) => {
    res.json(services.reports.ordersByStatus());
  }));

  router.get("/reports/top-products", asyncHandler(async (req, res) => {
    res.json(services.reports.topProducts());
  }));

  return router;
}

module.exports = { createApiRouter };
