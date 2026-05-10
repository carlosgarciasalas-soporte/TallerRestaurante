const { Router } = require("express");
const { asyncHandler } = require("../middlewares/asyncHandler");
const { AppError } = require("../../../shared/errors/AppError");

function createCrudRouter(service, requiredFields = []) {
  const router = Router();

  router.get("/", asyncHandler(async (req, res) => {
    res.json(service.list(req.query));
  }));

  router.post("/", asyncHandler(async (req, res) => {
    requiredFields.forEach((field) => {
      if (req.body[field] === undefined || req.body[field] === "") {
        throw new AppError(`Campo requerido faltante: ${field}.`, 400);
      }
    });

    res.status(201).json(service.create(req.body));
  }));

  router.get("/:id", asyncHandler(async (req, res) => {
    res.json(service.get(req.params.id));
  }));

  router.put("/:id", asyncHandler(async (req, res) => {
    res.json(service.update(req.params.id, req.body));
  }));

  router.delete("/:id", asyncHandler(async (req, res) => {
    res.json(service.delete(req.params.id));
  }));

  return router;
}

module.exports = { createCrudRouter };
