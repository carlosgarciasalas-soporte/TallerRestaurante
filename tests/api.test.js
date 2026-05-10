const request = require("supertest");
const { createApp } = require("../src/infrastructure/http/app");

describe("SIGR Linea Base API", () => {
  let app;

  beforeEach(() => {
    app = createApp({ seed: true });
  });

  test("expone el estado de salud del servicio", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  test("autentica un usuario de prueba", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@sigr.local", password: "admin123" });

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe("administrador");
    expect(response.body.token).toBeDefined();
  });

  test("lista productos con paginacion", async () => {
    const response = await request(app).get("/api/products?page=1&limit=2");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta.total).toBeGreaterThanOrEqual(3);
    expect(response.body.meta.page).toBe(1);
  });

  test("crea un pedido maestro-detalle y consulta sus items enriquecidos", async () => {
    const created = await request(app)
      .post("/api/orders")
      .send({
        customerId: "3",
        tableNumber: 5,
        items: [
          { productId: "1", quantity: 2 },
          { productId: "3", quantity: 1 }
        ]
      });

    expect(created.status).toBe(201);
    expect(created.body.total).toBe(24000);

    const fetched = await request(app).get(`/api/orders/${created.body.id}`);

    expect(fetched.status).toBe(200);
    expect(fetched.body.items).toHaveLength(2);
    expect(fetched.body.items[0].product.name).toBe("Empanadas de carne");
    expect(fetched.body.customer.name).toBe("Carlos Cliente");
  });

  test("expone resumen de dashboard para la demo", async () => {
    const response = await request(app).get("/api/dashboard/summary");

    expect(response.status).toBe(200);
    expect(response.body.products).toBe(15);
    expect(response.body.customers).toBe(10);
    expect(response.body.activeOrders).toBeGreaterThan(0);
  });

  test("filtra clientes y conserva paginacion de servidor", async () => {
    const response = await request(app).get("/api/users?page=1&limit=6&role=cliente");

    expect(response.status).toBe(200);
    expect(response.body.meta.total).toBe(10);
    expect(response.body.data.every((user) => user.role === "cliente")).toBe(true);
  });

  test("registra pago y genera reporte diario de ventas", async () => {
    const order = await request(app)
      .post("/api/orders")
      .send({
        customerId: "3",
        items: [{ productId: "2", quantity: 1 }]
      });

    const payment = await request(app)
      .post("/api/payments")
      .send({ orderId: order.body.id, amount: order.body.total, method: "efectivo" });

    expect(payment.status).toBe(201);

    const report = await request(app).get("/api/reports/daily-sales");

    expect(report.status).toBe(200);
    expect(report.body.totalSales).toBeGreaterThanOrEqual(22000);
  });
});
