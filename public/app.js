const state = {
  endpoint: "/api/products?page=1&limit=10"
};

const statusEl = document.querySelector("#apiStatus");
const responseBox = document.querySelector("#responseBox");
const currentEndpoint = document.querySelector("#currentEndpoint");
const refreshButton = document.querySelector("#refreshButton");
const navButtons = document.querySelectorAll("[data-endpoint]");

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}

async function fetchJson(endpoint) {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

async function loadSummary() {
  const [products, orders, reservations, sales] = await Promise.all([
    fetchJson("/api/products?page=1&limit=1"),
    fetchJson("/api/orders?page=1&limit=1"),
    fetchJson("/api/reservations?page=1&limit=1"),
    fetchJson("/api/reports/daily-sales")
  ]);

  document.querySelector("#productsCount").textContent = products.meta.total;
  document.querySelector("#ordersCount").textContent = orders.meta.total;
  document.querySelector("#reservationsCount").textContent = reservations.meta.total;
  document.querySelector("#salesTotal").textContent = formatCurrency(sales.totalSales);
}

async function loadEndpoint(endpoint) {
  state.endpoint = endpoint;
  currentEndpoint.textContent = endpoint;
  responseBox.textContent = "Cargando...";

  const data = await fetchJson(endpoint);
  responseBox.textContent = JSON.stringify(data, null, 2);
}

async function boot() {
  try {
    await fetchJson("/api/health");
    statusEl.textContent = "API activa";
    statusEl.className = "status ok";
    await loadSummary();
    await loadEndpoint(state.endpoint);
  } catch (error) {
    statusEl.textContent = "Sin conexion";
    statusEl.className = "status error";
    responseBox.textContent = error.message;
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    navButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    await loadEndpoint(button.dataset.endpoint);
  });
});

refreshButton.addEventListener("click", async () => {
  await loadSummary();
  await loadEndpoint(state.endpoint);
});

boot();
