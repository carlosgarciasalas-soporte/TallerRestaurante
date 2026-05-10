const PAYMENT_METHODS = ["efectivo", "tarjeta", "transferencia"];

function createPayment({ id, orderId, amount, method = "efectivo", paidAt }) {
  if (!orderId || Number(amount) <= 0) {
    throw new Error("El pago requiere pedido y monto valido.");
  }

  if (!PAYMENT_METHODS.includes(method)) {
    throw new Error(`Metodo de pago invalido. Metodos permitidos: ${PAYMENT_METHODS.join(", ")}.`);
  }

  return {
    id,
    orderId,
    amount: Number(amount),
    method,
    paidAt: paidAt || new Date().toISOString()
  };
}

module.exports = { createPayment, PAYMENT_METHODS };
