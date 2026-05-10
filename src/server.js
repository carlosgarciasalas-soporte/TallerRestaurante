const { createApp } = require("./infrastructure/http/app");

const PORT = process.env.PORT || 3000;
const app = createApp();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SIGR Linea Base API disponible en http://localhost:${PORT}/api`);
  });
}

module.exports = app;
