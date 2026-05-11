const { CrudService } = require("./CrudService");
const { AppError } = require("../../shared/errors/AppError");

class ProductService extends CrudService {
  constructor(productRepository, categoryRepository, factory) {
    super(productRepository, factory, "Producto");
    this.categoryRepository = categoryRepository;
  }

  create(payload) {
    this.ensureCategoryExists(payload.categoryId);
    return super.create(payload);
  }

  update(id, payload) {
    const current = this.get(id);
    this.ensureCategoryExists(payload.categoryId || current.categoryId);
    return super.update(id, payload);
  }

  ensureCategoryExists(categoryId) {
    if (!this.categoryRepository.findById(categoryId)) {
      throw new AppError("La categoria del producto no existe.", 400);
    }
  }
}

module.exports = { ProductService };
