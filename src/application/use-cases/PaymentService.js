const { createPayment } = require("../../domain/entities/Payment");
const { AppError } = require("../../shared/errors/AppError");

class PaymentService {
  constructor(paymentRepository, orderRepository) {
    this.paymentRepository = paymentRepository;
    this.orderRepository = orderRepository;
  }

  create(payload) {
    const order = this.orderRepository.findById(payload.orderId);
    if (!order) {
      throw new AppError("El pedido asociado al pago no existe.", 400);
    }

    try {
      const payment = this.paymentRepository.create(createPayment(payload));
      this.orderRepository.update(order.id, { status: "pagado" });
      return payment;
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }
}

module.exports = { PaymentService };
