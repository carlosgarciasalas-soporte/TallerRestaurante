const state = {
  view: "dashboard",
  productsPage: 1,
  customersPage: 1,
  limit: 6
};

const titles = {
  dashboard: "Dashboard",
  offers: "Ofertas del dia",
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
const modal = document.querySelector("#entityModal");
const modalBackdrop = document.querySelector("#modalBackdrop");

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

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(endpoint, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  return data;
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
  viewRoot.innerHTML = `<section class="admin-dashboard skeleton"></section>`;

  const [analytics, recentOrders, topProducts] = await Promise.all([
    fetchJson("/api/dashboard/analytics"),
    fetchJson("/api/dashboard/recent-orders?limit=5"),
    fetchJson("/api/reports/top-products")
  ]);

  const revenuePoints = analytics.revenueSeries.map((item, index) => {
    const x = index * 44 + 10;
    const y = 116 - Math.round(item.income / 19000 * 92);
    return `${x},${y}`;
  }).join(" ");
  const expensePoints = analytics.revenueSeries.map((item, index) => {
    const x = index * 44 + 10;
    const y = 116 - Math.round(item.expense / 19000 * 92);
    return `${x},${y}`;
  }).join(" ");
  const maxOrders = Math.max(...analytics.ordersOverview.map((item) => item.orders));
  const categoryTotal = analytics.topCategories.reduce((sum, item) => sum + item.value, 0) || 1;
  const averageTicket = analytics.totals.orders ? Math.round(analytics.totals.revenue / analytics.totals.orders) : 0;
  const kpis = [
    { label: "Total Órdenes", value: analytics.totals.orders, trend: "↑ 15.5%", hint: "vs semana anterior", icon: "O", tone: "up" },
    { label: "Total Clientes", value: analytics.totals.customers.toLocaleString("es-CO"), trend: "↑ 4.2%", hint: "vs semana anterior", icon: "C", tone: "up" },
    { label: "Ingresos Totales", value: formatCurrency(analytics.totals.revenue), trend: "↓ 2.36%", hint: "vs semana anterior", icon: "$", tone: "down-good" },
    { label: "Ticket Promedio", value: formatCurrency(averageTicket), trend: "↓ 1.25%", hint: "vs semana anterior", icon: "T", tone: "down" }
  ];

  viewRoot.innerHTML = `
    <section class="admin-dashboard">
      <div class="dashboard-main">
        <section class="kpi-row">
          ${kpis.map((item) => `
            <article class="kpi-card">
              <span class="kpi-icon">${item.icon}</span>
              <div>
                <span>${item.label}</span>
                <strong>${item.value}</strong>
                <small class="${item.tone}">${item.trend}</small>
                <em>${item.hint}</em>
              </div>
            </article>
          `).join("")}
        </section>

        <section class="chart-card revenue-card">
          <div class="card-header">
            <div><p class="eyebrow">Ingresos</p><h2>${formatCurrency(analytics.totals.revenue + analytics.expenses)}</h2></div>
            <span>Últimos 8 meses</span>
          </div>
          <svg class="line-chart" viewBox="0 0 330 132" role="img" aria-label="Revenue chart">
            <polyline points="${expensePoints}" fill="none" stroke="#1f2937" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
            <polyline points="${revenuePoints}" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
          </svg>
          <div class="chart-legend"><span class="dot orange"></span>Ingresos <span class="dot dark"></span>Gastos</div>
        </section>

        <section class="chart-card overview-card">
          <div class="card-header">
            <div><p class="eyebrow">Órdenes</p><h2>Órdenes por día</h2></div>
            <span>Esta semana</span>
          </div>
          <div class="bar-chart">
            ${analytics.ordersOverview.map((item) => `
              <div class="bar-item">
                <span style="height:${Math.max(28, Math.round(item.orders / maxOrders * 150))}px"></span>
                <small>${item.label}</small>
              </div>
            `).join("")}
          </div>
        </section>

        <section class="chart-card split-card">
          <div>
            <div class="card-header"><div><p class="eyebrow">Categorías</p><h2>Categorías más vendidas</h2></div></div>
            <div class="donut" style="--a:${Math.round(analytics.topCategories[0].value / categoryTotal * 100)}%; --b:${Math.round(analytics.topCategories[1].value / categoryTotal * 100)}%;"></div>
            <ul class="mini-list">
              ${analytics.topCategories.map((item) => `<li><span>${item.name}</span><strong>${Math.round(item.value / categoryTotal * 100)}%</strong></li>`).join("")}
            </ul>
          </div>
          <div>
            <div class="card-header"><div><p class="eyebrow">Tipos</p><h2>Tipos de órdenes</h2></div></div>
            <ul class="type-list">
              ${analytics.orderTypes.map((item) => `<li><span>${item.name}</span><strong>${item.value}</strong><small>${formatCurrency(item.amount)}</small></li>`).join("")}
            </ul>
          </div>
        </section>

        <section class="chart-card recent-table">
          <div class="card-header">
            <div><p class="eyebrow">Pedidos</p><h2>Pedidos recientes</h2></div>
            <button type="button" class="small-button" onclick="document.querySelector('[data-view=orders]').click()">Ver todos</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>ID Pedido</th><th>Menú</th><th>Items</th><th>Total</th><th>Cliente</th><th>Estado</th></tr></thead>
              <tbody>
                ${recentOrders.slice(0, 4).map((order) => `
                  <tr>
                    <td>ORD${order.id.padStart(4, "0")}</td>
                    <td>${order.items[0].product.name}</td>
                    <td>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td>${formatCurrency(order.total)}</td>
                    <td>${order.customer ? order.customer.name : "Cliente"}</td>
                    <td><span class="${statusClass(order.status)}">${order.status}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <aside class="dashboard-side">
        <section class="chart-card">
          <div class="card-header">
            <div><p class="eyebrow">Menu</p><h2>Trending Menus</h2></div>
            <span>This Week</span>
          </div>
          <div class="trend-list">
            ${topProducts.slice(0, 3).map((item) => `
              <article class="trend-card">
                <img src="${item.product.imageUrl}" alt="${item.product.name}">
                <h3>${item.product.name}</h3>
                <p>${item.product.description}</p>
                <strong>${formatCurrency(item.product.price)}</strong>
              </article>
            `).join("")}
          </div>
        </section>

        <section class="chart-card">
          <div class="card-header"><div><p class="eyebrow">Actividad</p><h2>Recent Activity</h2></div></div>
          <div class="activity-list">
            ${analytics.recentActivity.map((item) => `
              <div class="activity-item">
                <strong>${item.title}</strong>
                <span>${item.description}</span>
                <small>${item.time}</small>
              </div>
            `).join("")}
          </div>
        </section>

        <section class="chart-card">
          <div class="card-header"><div><p class="eyebrow">Reviews</p><h2>Customer Reviews</h2></div></div>
          <div class="review-list">
            ${analytics.reviews.map((review) => `
              <article class="review-card">
                <img src="${review.imageUrl}" alt="${review.title}">
                <div>
                  <strong>${review.title}</strong>
                  <p>${review.text}</p>
                  <span>${review.customer} - ${review.rating} / 5</span>
                </div>
              </article>
            `).join("")}
          </div>
        </section>
      </aside>
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
      <button type="button" id="createProductButton">Agregar producto</button>
    </section>
    <section class="product-grid">
      ${result.data.map((product) => `
        <article class="product-card" data-product-card="${product.id}">
          <img src="${product.imageUrl}" alt="${product.name}">
          <div>
            <span class="${product.available ? "badge status-disponible" : "badge status-cancelado"}">${product.available ? "Disponible" : "Agotado"}</span>
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <strong>${formatCurrency(product.price)}</strong>
            <button type="button" class="small-button product-edit" data-edit-product="${product.id}">Editar</button>
          </div>
        </article>
      `).join("")}
    </section>
    ${renderPagination("products", result.meta)}
  `;
  bindPagination();
  document.querySelector("#createProductButton").addEventListener("click", () => openProductModal());
  document.querySelectorAll("[data-edit-product]").forEach((button) => {
    button.addEventListener("click", async () => {
      const product = await fetchJson(`/api/products/${button.dataset.editProduct}`);
      openProductModal(product);
    });
  });
}

async function renderOffers() {
  const offers = [
    {
      name: "Pancerotti de pollo",
      description: "Masa dorada rellena de pollo sazonado, queso fundido y salsa de la casa.",
      price: 12000,
      imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Panzerotti-01.jpg"
    },
    {
      name: "Pancerotti hawaiano",
      description: "Relleno de jamon, queso mozzarella y pina en trozos dulces.",
      price: 13000,
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Pancerotti pollo especial",
      description: "Pollo, champinones, queso doble crema y toque de oregano.",
      price: 14500,
      imageUrl: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=900&q=80"
    }
  ];

  viewRoot.innerHTML = `
    <section class="offers-page">
      <div class="offers-copy">
        <p class="eyebrow">Promociones</p>
        <h2>Ofertas del dia</h2>
        <p>Tres pancerottis destacados rotando automaticamente para una experiencia tipo vitrina digital.</p>
      </div>
      <div class="offer-slider" aria-label="Ofertas automaticas">
        <div class="offer-track">
          ${offers.map((offer) => `
            <article class="offer-slide">
              <img src="${offer.imageUrl}" alt="${offer.name}">
              <div>
                <span class="badge status-disponible">Oferta activa</span>
                <h3>${offer.name}</h3>
                <p>${offer.description}</p>
                <strong>${formatCurrency(offer.price)}</strong>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
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
        <button type="button" id="createCustomerButton">Agregar cliente</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Telefono</th>
              <th>Estado</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            ${result.data.map((customer) => `
              <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td><span class="${customer.active ? "badge status-disponible" : "badge status-cancelado"}">${customer.active ? "Activo" : "Inactivo"}</span></td>
                <td><button type="button" class="small-button" data-edit-customer="${customer.id}">Editar</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
    ${renderPagination("customers", result.meta)}
  `;
  bindPagination();
  document.querySelector("#createCustomerButton").addEventListener("click", () => openCustomerModal());
  document.querySelectorAll("[data-edit-customer]").forEach((button) => {
    button.addEventListener("click", async () => {
      const customer = await fetchJson(`/api/users/${button.dataset.editCustomer}`);
      openCustomerModal(customer);
    });
  });
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
    if (state.view === "offers") await renderOffers();
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

if (refreshButton) {
  refreshButton.addEventListener("click", render);
}

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

function openCustomerModal(customer = null) {
  const isEdit = Boolean(customer);
  modal.innerHTML = `
    <form id="customerForm" class="form-card">
      <div class="modal-header">
        <div>
          <p class="eyebrow">Clientes</p>
          <h2>${isEdit ? "Modificar cliente" : "Agregar cliente"}</h2>
        </div>
        <button type="button" id="closeModal">Cerrar</button>
      </div>
      <label>
        Nombre
        <input name="name" required value="${customer ? customer.name : ""}">
      </label>
      <label>
        Correo
        <input name="email" type="email" required value="${customer ? customer.email : ""}">
      </label>
      <label>
        Telefono
        <input name="phone" required value="${customer ? customer.phone : ""}">
      </label>
      ${isEdit ? "" : `
        <label>
          Contrasena inicial
          <input name="password" type="password" required value="cliente123">
        </label>
      `}
      <label class="checkbox-row">
        <input name="active" type="checkbox" ${!customer || customer.active ? "checked" : ""}>
        Cliente activo
      </label>
      <p id="modalError" class="form-error" hidden></p>
      <div class="form-actions">
        <button type="button" id="cancelModal">Cancelar</button>
        <button type="submit">${isEdit ? "Guardar cambios" : "Crear cliente"}</button>
      </div>
    </form>
  `;

  showModal();
  document.querySelector("#closeModal").addEventListener("click", closeModal);
  document.querySelector("#cancelModal").addEventListener("click", closeModal);
  document.querySelector("#customerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name").trim(),
      email: form.get("email").trim(),
      phone: form.get("phone").trim(),
      role: "cliente",
      active: form.get("active") === "on"
    };
    if (!isEdit) {
      payload.password = form.get("password") || "cliente123";
    }

    try {
      await apiRequest(isEdit ? `/api/users/${customer.id}` : "/api/users", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      closeModal();
      await renderCustomers();
    } catch (error) {
      showModalError(error.message);
    }
  });
}

async function openProductModal(product = null) {
  const isEdit = Boolean(product);
  const categories = await fetchJson("/api/categories?page=1&limit=20");
  modal.innerHTML = `
    <form id="productForm" class="form-card">
      <div class="modal-header">
        <div>
          <p class="eyebrow">Productos</p>
          <h2>${isEdit ? "Modificar producto" : "Agregar producto"}</h2>
        </div>
        <button type="button" id="closeModal">Cerrar</button>
      </div>
      <label>
        Nombre
        <input name="name" required value="${product ? product.name : ""}">
      </label>
      <label>
        Categoria
        <select name="categoryId" required>
          ${categories.data.map((category) => `
            <option value="${category.id}" ${product && product.categoryId === category.id ? "selected" : ""}>${category.name}</option>
          `).join("")}
        </select>
      </label>
      <label>
        Precio
        <input name="price" type="number" min="1" required value="${product ? product.price : ""}">
      </label>
      <label>
        URL de imagen
        <input name="imageUrl" type="url" required value="${product ? product.imageUrl : ""}">
      </label>
      <label>
        Descripcion
        <textarea name="description" required>${product ? product.description : ""}</textarea>
      </label>
      <label class="checkbox-row">
        <input name="available" type="checkbox" ${!product || product.available ? "checked" : ""}>
        Producto disponible
      </label>
      <p id="modalError" class="form-error" hidden></p>
      <div class="form-actions">
        <button type="button" id="cancelModal">Cancelar</button>
        <button type="submit">${isEdit ? "Guardar cambios" : "Crear producto"}</button>
      </div>
    </form>
  `;

  showModal();
  document.querySelector("#closeModal").addEventListener("click", closeModal);
  document.querySelector("#cancelModal").addEventListener("click", closeModal);
  document.querySelector("#productForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name").trim(),
      categoryId: form.get("categoryId"),
      price: Number(form.get("price")),
      imageUrl: form.get("imageUrl").trim(),
      description: form.get("description").trim(),
      available: form.get("available") === "on"
    };

    try {
      await apiRequest(isEdit ? `/api/products/${product.id}` : "/api/products", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      closeModal();
      await renderProducts();
    } catch (error) {
      showModalError(error.message);
    }
  });
}

function showModal() {
  modal.hidden = false;
  modalBackdrop.hidden = false;
  requestAnimationFrame(() => {
    modal.classList.add("open");
    modalBackdrop.classList.add("open");
  });
}

function closeModal() {
  modal.classList.remove("open");
  modalBackdrop.classList.remove("open");
  setTimeout(() => {
    modal.hidden = true;
    modalBackdrop.hidden = true;
    modal.innerHTML = "";
  }, 180);
}

function showModalError(message) {
  const errorBox = document.querySelector("#modalError");
  errorBox.textContent = message;
  errorBox.hidden = false;
}

modalBackdrop.addEventListener("click", closeModal);
