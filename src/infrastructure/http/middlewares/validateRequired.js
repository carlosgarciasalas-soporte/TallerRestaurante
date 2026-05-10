const { AppError } = require("../../../shared/errors/AppError");

function validateRequired(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === "");

    if (missing.length > 0) {
      return next(new AppError("Campos requeridos faltantes.", 400, { missing }));
    }

    return next();
  };
}

module.exports = { validateRequired };
