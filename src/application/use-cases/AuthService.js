const { AppError } = require("../../shared/errors/AppError");

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  login({ email, password }) {
    const user = this.userRepository.findBy("email", email);

    if (!user || user.password !== password || user.active === false) {
      throw new AppError("Credenciales invalidas.", 401);
    }

    return {
      token: `demo-token-${user.id}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = { AuthService };
