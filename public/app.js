const state = {
  view: "dashboard"
};

const titles = {
  dashboard: "Dashboard",
  products: "Productos",
  customers: "Clientes",
  orders: "Pedidos"
};

const statusEl = document.querySelector("#apiStatus");
const viewTitle = document.querySelector("#viewTitle");
const viewRoot = document.querySelector("#viewRoot");
const refreshButton = document.querySelector("#refreshButton");
const menuButtons = document.querySelectorAll("[data-view]");

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value || 0);
}

async function fetchJson(endpoint) {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

function setStatus(ok) {
  statusEl.textContent = ok ? "API activa" : "Sin conexion";
  statusEl.className = ok ? "status ok" : "status error";
}

function setView(view) {
  state.view = view;
  viewTitle.textContent = titles[view];
  menuButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  render();
}

function renderPlaceholder(message) {
  viewRoot.innerHTML = `
    <section class="empty-state">
      <p class="eyebrow">Demo SIGR</p>
      <h2>${message}</h2>
      <p>Esta vista se conectara con los endpoints de la linea base en la siguiente fase.</p>
    </section>
  `;
}

async function renderDashboard() {
  viewRoot.innerHTML = `
    <section class="bento-grid">
      <article class="metric-card skeleton"></article>
      <article class="metric-card skeleton"></article>
      <article class="metric-card skeleton"></article>
      <article class="metric-card skeleton"></article>
      <article class="wide-card skeleton"></article>
      <article class="wide-card skeleton"></article>
    </section>
  `;

  const [summary, recentOrders, topProducts] = await Promise.all([
    fetchJson("/api/dashboard/summary"),
    fetchJson("/api/dashboard/recent-orders?limit=5"),
    fetchJson("/api/reports/top-products")
  ]);

  viewRoot.innerHTML = `
    <section class="bento-grid">
      <article class="metric-card">
        <p>Ventas del dia</p>
        <strong>${formatCurrency(summary.dailySales)}</strong>
        <span>${summary.activeOrders} pedidos activos</span>
      </article>
      <article class="metric-card">
        <p>Clientes</p>
        <strong>${summary.customers}</strong>
        <span>Usuarios tipo cliente</span>
      </article>
      <article class="metric-card">
        <p>Productos</p>
        <strong>${summary.products}</strong>
        <span>${summary.availableProducts} disponibles</span>
      </article>
      <article class="metric-card">
        <p>Reservas</p>
        <strong>${summary.reservations}</strong>
        <span>Agenda inicial</span>
      </article>
      <article class="wide-card">
        <div class="card-header">
          <div>
            <p class="eyebrow">Operacion</p>
            <h2>Ultimos pedidos</h2>
          </div>
        </div>
        <div class="order-list">
          ${recentOrders.map((order) => `
            <div class="order-row">
              <div>
                <strong>#${order.id} - ${order.customer ? order.customer.name : "Cliente"}</strong>
                <span>Mesa ${order.tableNumber || "N/A"} · ${order.items.length} items</span>
              </div>
              <div>
                <span class="badge">${order.status}</span>
                <strong>${formatCurrency(order.total)}</strong>
              </div>
            </div>
          `).join("")}
        </div>
      </article>
      <article class="wide-card">
        <div class="card-header">
          <div>
            <p class="eyebrow">Menu</p>
            <h2>Productos mas vendidos</h2>
          </div>
        </div>
        <div class="top-products">
          ${topProducts.slice(0, 4).map((item) => `
            <div class="product-chip">
              <img src="${item.product.imageUrl}" alt="${item.product.name}">
              <div>
                <strong>${item.product.name}</strong>
                <span>${item.quantity} unidades</span>
              </div>
            </div>
          `).join("")}
        </div>
      </article>
    </section>
  `;
}

async function renderProducts() {
  renderPlaceholder("Catalogo de productos");
}

async function renderCustomers() {
  renderPlaceholder("Listado de clientes");
}

async function renderOrders() {
  renderPlaceholder("Pedidos maestro-detalle");
}

async function render() {
  try {
    await fetchJson("/api/health");
    setStatus(true);

    if (state.view === "dashboard") await renderDashboard();
    if (state.view === "products") await renderProducts();
    if (state.view === "customers") await renderCustomers();
    if (state.view === "orders") await renderOrders();
  } catch (error) {
    setStatus(false);
    viewRoot.innerHTML = `<section class="empty-state"><h2>No fue posible conectar con la API</h2><p>${error.message}</p></section>`;
  }
}

menuButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

refreshButton.addEventListener("click", render);

render();
