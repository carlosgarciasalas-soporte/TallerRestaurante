const { AppError } = require("../../../shared/errors/AppError");

function errorHandler(error, req, res, next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details
    });
  }

  return res.status(500).json({
    error: "Error interno del servidor."
  });
}

module.exports = { errorHandler };
