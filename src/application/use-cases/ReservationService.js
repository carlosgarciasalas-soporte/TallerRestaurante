const { CrudService } = require("./CrudService");
const { AppError } = require("../../shared/errors/AppError");

class ReservationService extends CrudService {
  constructor(repository, factory) {
    super(repository, factory, "Reserva");
  }

  create(payload) {
    this.ensureSlotAvailable(payload.date, payload.time);
    return super.create(payload);
  }

  update(id, payload) {
    const current = this.get(id);
    const date = payload.date || current.date;
    const time = payload.time || current.time;
    this.ensureSlotAvailable(date, time, id);
    return super.update(id, payload);
  }

  ensureSlotAvailable(date, time, currentId = null) {
    const duplicated = this.repository
      .all()
      .find((reservation) => (
        reservation.id !== String(currentId)
        && reservation.date === date
        && reservation.time === time
        && reservation.status !== "cancelada"
      ));

    if (duplicated) {
      throw new AppError("Ya existe una reserva activa para esa fecha y hora.", 400);
    }
  }
}

module.exports = { ReservationService };
