// backend/middleware/roleMiddleware.js
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    const usuarioRol = req.usuario?.rol;

    if (!usuarioRol || !rolesPermitidos.includes(usuarioRol)) {
      return res.status(403).json({ error: "Acceso denegado: privilegios insuficientes" });
    }

    next();
  };
};

module.exports = verificarRol;
