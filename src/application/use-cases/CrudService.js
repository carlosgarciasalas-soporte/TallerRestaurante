const { AppError } = require("../../shared/errors/AppError");
const { getPagination, buildPaginatedResult } = require("../../shared/pagination/paginate");

class CrudService {
  constructor(repository, factory, entityName) {
    this.repository = repository;
    this.factory = factory;
    this.entityName = entityName;
  }

  list(query) {
    const pagination = getPagination(query);

    if (query && query.role && typeof this.repository.all === "function") {
      const filtered = this.repository.all().filter((item) => item.role === query.role);
      return buildPaginatedResult(
        filtered.slice(pagination.offset, pagination.offset + pagination.limit),
        filtered.length,
        pagination.page,
        pagination.limit
      );
    }

    return this.repository.findAll(pagination);
  }

  get(id) {
    const record = this.repository.findById(id);
    if (!record) {
      throw new AppError(`${this.entityName} no encontrado.`, 404);
    }
    return record;
  }

  create(payload) {
    try {
      const entity = this.factory(payload);
      return this.repository.create(entity);
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }

  update(id, payload) {
    const current = this.get(id);

    try {
      const entity = this.factory({ ...current, ...payload, id: current.id });
      return this.repository.update(id, entity);
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }

  delete(id) {
    this.get(id);
    this.repository.delete(id);
    return { deleted: true };
  }
}

module.exports = { CrudService };
