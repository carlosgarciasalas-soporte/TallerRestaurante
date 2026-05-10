const state = {
  view: "dashboard",
  productsPage: 1,
  customersPage: 1,
  limit: 6
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
const drawer = document.querySelector("#orderDrawer");
const drawerBackdrop = document.querySelector("#drawerBackdrop");

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

function statusClass(status) {
  return `badge status-${String(status).replace("_", "-")}`;
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
                <span class="${statusClass(order.status)}">${order.status}</span>
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
  viewRoot.innerHTML = `
    <section class="toolbar">
      <p>Catalogo visual con paginacion desde servidor.</p>
    </section>
    <section class="product-grid">
      ${Array.from({ length: 6 }).map(() => "<article class=\"product-card skeleton\"></article>").join("")}
    </section>
  `;

  const result = await fetchJson(`/api/products?page=${state.productsPage}&limit=${state.limit}`);

  viewRoot.innerHTML = `
    <section class="toolbar">
      <p>${result.meta.total} productos registrados</p>
    </section>
    <section class="product-grid">
      ${result.data.map((product) => `
        <article class="product-card">
          <img src="${product.imageUrl}" alt="${product.name}">
          <div>
            <span class="${product.available ? "badge status-disponible" : "badge status-cancelado"}">${product.available ? "Disponible" : "Agotado"}</span>
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <strong>${formatCurrency(product.price)}</strong>
          </div>
        </article>
      `).join("")}
    </section>
    ${renderPagination("products", result.meta)}
  `;
  bindPagination();
}

async function renderCustomers() {
  viewRoot.innerHTML = `<section class="data-panel skeleton"></section>`;

  const result = await fetchJson(`/api/users?page=${state.customersPage}&limit=${state.limit}&role=cliente`);

  viewRoot.innerHTML = `
    <section class="data-panel">
      <div class="card-header">
        <div>
          <p class="eyebrow">Clientes</p>
          <h2>Base de clientes demo</h2>
        </div>
        <span>${result.meta.total} registros</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Telefono</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${result.data.map((customer) => `
              <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td><span class="${customer.active ? "badge status-disponible" : "badge status-cancelado"}">${customer.active ? "Activo" : "Inactivo"}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
    ${renderPagination("customers", result.meta)}
  `;
  bindPagination();
}

async function renderOrders() {
  viewRoot.innerHTML = `<section class="data-panel skeleton"></section>`;

  const result = await fetchJson("/api/orders?page=1&limit=10");

  viewRoot.innerHTML = `
    <section class="data-panel">
      <div class="card-header">
        <div>
          <p class="eyebrow">Maestro</p>
          <h2>Pedidos recientes</h2>
        </div>
        <span>${result.meta.total} pedidos</span>
      </div>
      <div class="order-master">
        ${result.data.map((order) => `
          <button type="button" class="order-master-row" data-order-id="${order.id}">
            <div>
              <strong>#${order.id} - ${order.customer ? order.customer.name : "Cliente"}</strong>
              <span>Mesa ${order.tableNumber || "N/A"} · ${order.items.length} items · ${formatCurrency(order.total)}</span>
            </div>
            <span class="${statusClass(order.status)}">${order.status}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;

  document.querySelectorAll("[data-order-id]").forEach((button) => {
    button.addEventListener("click", () => openOrderDrawer(button.dataset.orderId));
  });
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

function renderPagination(type, meta) {
  return `
    <nav class="pagination" aria-label="Paginacion de ${type}">
      <button type="button" data-page-target="${type}" data-page="${meta.page - 1}" ${meta.page <= 1 ? "disabled" : ""}>Anterior</button>
      <span>Pagina ${meta.page} de ${meta.totalPages}</span>
      <button type="button" data-page-target="${type}" data-page="${meta.page + 1}" ${meta.page >= meta.totalPages ? "disabled" : ""}>Siguiente</button>
    </nav>
  `;
}

function bindPagination() {
  document.querySelectorAll("[data-page-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const page = Number(button.dataset.page);
      if (button.dataset.pageTarget === "products") {
        state.productsPage = page;
      }
      if (button.dataset.pageTarget === "customers") {
        state.customersPage = page;
      }
      render();
    });
  });
}

async function openOrderDrawer(orderId) {
  const order = await fetchJson(`/api/orders/${orderId}`);

  drawer.innerHTML = `
    <div class="drawer-header">
      <div>
        <p class="eyebrow">Detalle</p>
        <h2>Pedido #${order.id}</h2>
      </div>
      <button type="button" id="closeDrawer">Cerrar</button>
    </div>

    <section class="drawer-section">
      <p>Cliente</p>
      <strong>${order.customer ? order.customer.name : "Cliente no disponible"}</strong>
      <span>${order.customer ? order.customer.email : ""}</span>
    </section>

    <section class="drawer-section">
      <p>Estado</p>
      <span class="${statusClass(order.status)}">${order.status}</span>
      <span>Mesa ${order.tableNumber || "N/A"}</span>
    </section>

    <section class="drawer-section">
      <p>Items</p>
      <div class="drawer-items">
        ${order.items.map((item) => `
          <div class="drawer-item">
            <img src="${item.product.imageUrl}" alt="${item.product.name}">
            <div>
              <strong>${item.product.name}</strong>
              <span>${item.quantity} x ${formatCurrency(item.unitPrice)}</span>
            </div>
            <strong>${formatCurrency(item.subtotal)}</strong>
          </div>
        `).join("")}
      </div>
    </section>

    <div class="drawer-total">
      <span>Total</span>
      <strong>${formatCurrency(order.total)}</strong>
    </div>
  `;

  drawer.hidden = false;
  drawerBackdrop.hidden = false;
  requestAnimationFrame(() => {
    drawer.classList.add("open");
    drawerBackdrop.classList.add("open");
  });

  document.querySelector("#closeDrawer").addEventListener("click", closeOrderDrawer);
}

function closeOrderDrawer() {
  drawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
  setTimeout(() => {
    drawer.hidden = true;
    drawerBackdrop.hidden = true;
  }, 180);
}

drawerBackdrop.addEventListener("click", closeOrderDrawer);
