const { buildPaginatedResult } = require("../../shared/pagination/paginate");

class InMemoryRepository {
  constructor(initialData = []) {
    this.items = new Map();
    this.sequence = 1;

    initialData.forEach((item) => this.create(item));
  }

  create(payload) {
    const id = payload.id || String(this.sequence++);
    const record = { ...payload, id };
    this.items.set(id, record);
    return record;
  }

  findAll({ page = 1, limit = 10, offset = 0 } = {}) {
    const values = Array.from(this.items.values());
    return buildPaginatedResult(values.slice(offset, offset + limit), values.length, page, limit);
  }

  findById(id) {
    return this.items.get(String(id)) || null;
  }

  findBy(field, value) {
    return Array.from(this.items.values()).find((item) => item[field] === value) || null;
  }

  update(id, payload) {
    const current = this.findById(id);
    if (!current) {
      return null;
    }

    const updated = { ...current, ...payload, id: current.id };
    this.items.set(String(id), updated);
    return updated;
  }

  delete(id) {
    return this.items.delete(String(id));
  }

  all() {
    return Array.from(this.items.values());
  }

  clear() {
    this.items.clear();
    this.sequence = 1;
  }
}

module.exports = { InMemoryRepository };
