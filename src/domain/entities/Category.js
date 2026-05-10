function createCategory({ id, name, description = "", active = true }) {
  if (!name) {
    throw new Error("La categoria requiere nombre.");
  }

  return { id, name, description, active };
}

module.exports = { createCategory };
