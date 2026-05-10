const { createContainer } = require("./container");

const container = createContainer({ seed: true });

console.log("Datos de prueba cargados para la linea base SIGR.");
console.log({
  users: container.repositories.users.all().length,
  categories: container.repositories.categories.all().length,
  products: container.repositories.products.all().length,
  orders: container.repositories.orders.all().length,
  payments: container.repositories.payments.all().length,
  reservations: container.repositories.reservations.all().length
});
