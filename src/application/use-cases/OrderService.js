const { createOrder, ORDER_STATUSES } = require("../../domain/entities/Order");
const { AppError } = require("../../shared/errors/AppError");
const { getPagination } = require("../../shared/pagination/paginate");

class OrderService {
  constructor(orderRepository, productRepository, userRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  list(query) {
    return this.orderRepository.findAll(getPagination(query));
  }

  get(id) {
    const order = this.orderRepository.findById(id);
    if (!order) {
      throw new AppError("Pedido no encontrado.", 404);
    }

    return {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: this.productRepository.findById(item.productId)
      }))
    };
  }

  create(payload) {
    const customer = this.userRepository.findById(payload.customerId);
    if (!customer) {
      throw new AppError("El cliente del pedido no existe.", 400);
    }

    const items = (payload.items || []).map((item) => {
      const product = this.productRepository.findById(item.productId);
      if (!product || product.available === false) {
        throw new AppError(`Producto no disponible: ${item.productId}.`, 400);
      }

      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price
      };
    });

    try {
      return this.orderRepository.create(createOrder({ ...payload, items }));
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }

  updateStatus(id, status) {
    if (!ORDER_STATUSES.includes(status)) {
      throw new AppError(`Estado invalido. Estados permitidos: ${ORDER_STATUSES.join(", ")}.`, 400);
    }

    const order = this.orderRepository.findById(id);
    if (!order) {
      throw new AppError("Pedido no encontrado.", 404);
    }

    return this.orderRepository.update(id, { status });
  }

  delete(id) {
    const order = this.orderRepository.findById(id);
    if (!order) {
      throw new AppError("Pedido no encontrado.", 404);
    }

    this.orderRepository.delete(id);
    return { deleted: true };
  }
}

module.exports = { OrderService };
