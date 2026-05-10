function createProduct({ id, categoryId, name, description = "", price, available = true }) {
  if (!categoryId || !name || price === undefined) {
    throw new Error("El producto requiere categoria, nombre y precio.");
  }

  if (Number(price) <= 0) {
    throw new Error("El precio del producto debe ser mayor que cero.");
  }

  return {
    id,
    categoryId,
    name,
    description,
    price: Number(price),
    available
  };
}

module.exports = { createProduct };
