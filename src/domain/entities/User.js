const VALID_ROLES = ["cliente", "mesero", "administrador"];

function createUser({ id, name, email, password, role = "cliente", active = true }) {
  if (!name || !email || !password) {
    throw new Error("El usuario requiere nombre, correo y contrasena.");
  }

  if (!VALID_ROLES.includes(role)) {
    throw new Error(`Rol invalido. Roles permitidos: ${VALID_ROLES.join(", ")}.`);
  }

  return { id, name, email, password, role, active };
}

module.exports = { createUser, VALID_ROLES };
