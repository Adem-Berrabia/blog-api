/**
 * Middleware de gestion globale des erreurs
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';

  // Erreur Mongoose : ID invalide
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Ressource introuvable. ID invalide : ${err.value}`;
  }

  // Erreur Mongoose : champ unique dupliqué
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `La valeur du champ "${field}" existe déjà.`;
  }

  // Erreur Mongoose : validation
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token JWT invalide.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token JWT expiré.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Middleware pour les routes non trouvées
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route introuvable : ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
