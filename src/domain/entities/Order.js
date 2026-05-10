const ORDER_STATUSES = ["pendiente", "en_preparacion", "servido", "cancelado", "pagado"];

function createOrder({ id, customerId, tableNumber, items, status = "pendiente", createdAt }) {
  if (!customerId || !Array.isArray(items) || items.length === 0) {
    throw new Error("El pedido requiere cliente y al menos un item.");
  }

  if (!ORDER_STATUSES.includes(status)) {
    throw new Error(`Estado de pedido invalido. Estados permitidos: ${ORDER_STATUSES.join(", ")}.`);
  }

  const normalizedItems = items.map((item) => {
    if (!item.productId || Number(item.quantity) <= 0 || Number(item.unitPrice) <= 0) {
      throw new Error("Cada item requiere producto, cantidad y precio unitario validos.");
    }

    return {
      productId: item.productId,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.quantity) * Number(item.unitPrice)
    };
  });

  const total = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    id,
    customerId,
    tableNumber: tableNumber || null,
    items: normalizedItems,
    status,
    total,
    createdAt: createdAt || new Date().toISOString()
  };
}

module.exports = { createOrder, ORDER_STATUSES };
