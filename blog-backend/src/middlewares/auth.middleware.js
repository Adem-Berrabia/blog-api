const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware : vérifier le token JWT
 * Protège les routes privées
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé. Token manquant.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable ou désactivé.",
      });
    }

    // ✅ Block suspended users
    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Votre compte a été suspendu. Contactez un administrateur.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré.",
    });
  }
};

/**
 * Middleware : vérifier le rôle admin
 * Doit être utilisé après protect()
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Accès refusé. Droits administrateur requis.",
  });
};

/**
 * ✅ Middleware : vérifier le rôle éditeur
 * Doit être utilisé après protect()
 */
const editorOnly = (req, res, next) => {
  if (req.user && req.user.role === "editor") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Accès refusé. Droits éditeur requis.",
  });
};

/**
 * ✅ Middleware : autoriser plusieurs rôles
 * Usage : requireRole('admin', 'editor')
 * Doit être utilisé après protect()
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé. Non authentifié.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôle requis : ${roles.join(" ou ")}.`,
      });
    }

    next();
  };
};

/**
 * ✅ Middleware : vérifier que le compte est actif (pas pending/suspended)
 * Doit être utilisé après protect()
 */
const activeOnly = (req, res, next) => {
  if (req.user && req.user.status === "active") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Votre compte est en attente de validation ou suspendu.",
  });
};

/**
 * Middleware : optionnel (pas d'erreur si pas de token)
 * Utile pour les routes publiques qui bénéficient du contexte user
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch {
    next();
  }
};

module.exports = {
  protect,
  adminOnly,
  editorOnly, // ✅ new
  requireRole, // ✅ new
  activeOnly, // ✅ new
  optionalAuth,
};
