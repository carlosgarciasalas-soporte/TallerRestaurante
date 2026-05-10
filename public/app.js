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
  renderPlaceholder("Dashboard operativo");
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
