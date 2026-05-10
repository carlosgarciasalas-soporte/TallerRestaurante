const express = require("express");
const cors = require("cors");
const path = require("path");
const { createApiRouter } = require("./routes");
const { createContainer } = require("../database/container");
const { errorHandler } = require("./middlewares/errorHandler");

function createApp(options = {}) {
  const app = express();
  const container = options.container || createContainer({ seed: options.seed !== false });

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "../../../public")));
  app.use("/api", createApiRouter(container.services));

  app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada." });
  });

  app.use(errorHandler);

  app.locals.container = container;

  return app;
}

module.exports = { createApp };
