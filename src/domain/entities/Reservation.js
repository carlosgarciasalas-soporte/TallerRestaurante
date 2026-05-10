const RESERVATION_STATUSES = ["pendiente", "confirmada", "cancelada"];

function createReservation({ id, customerName, phone, date, time, people, status = "pendiente" }) {
  if (!customerName || !phone || !date || !time || Number(people) <= 0) {
    throw new Error("La reserva requiere cliente, telefono, fecha, hora y numero de personas.");
  }

  if (!RESERVATION_STATUSES.includes(status)) {
    throw new Error(`Estado de reserva invalido. Estados permitidos: ${RESERVATION_STATUSES.join(", ")}.`);
  }

  return {
    id,
    customerName,
    phone,
    date,
    time,
    people: Number(people),
    status
  };
}

module.exports = { createReservation, RESERVATION_STATUSES };
