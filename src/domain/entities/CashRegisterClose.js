function createCashRegisterClose({ id, date, totalSales = 0, paymentsCount = 0, payments = [], closedAt }) {
  if (!date) {
    throw new Error("El cierre de caja requiere fecha.");
  }

  return {
    id,
    date,
    totalSales: Number(totalSales),
    paymentsCount: Number(paymentsCount),
    payments,
    closedAt: closedAt || new Date().toISOString()
  };
}

module.exports = { createCashRegisterClose };
