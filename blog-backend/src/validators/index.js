const Joi = require('joi');

// ─────────────────────────────────────────────
// VALIDATORS AUTH
// ─────────────────────────────────────────────

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 50 caractères',
    'any.required': 'Le nom est obligatoire',
  }),
  email: Joi.string().email().required().messages({
    'string.email': "Format d'email invalide",
    'any.required': "L'email est obligatoire",
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    'any.required': 'Le mot de passe est obligatoire',
  }),
  bio: Joi.string().max(300).optional().allow(''),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': "Format d'email invalide",
    'any.required': "L'email est obligatoire",
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est obligatoire',
  }),
});

// ─────────────────────────────────────────────
// VALIDATORS ARTICLE
// ─────────────────────────────────────────────

const createArticleSchema = Joi.object({
  title: Joi.string().min(5).max(150).required().messages({
    'string.min': 'Le titre doit contenir au moins 5 caractères',
    'string.max': 'Le titre ne peut pas dépasser 150 caractères',
    'any.required': 'Le titre est obligatoire',
  }),
  content: Joi.string().min(20).required().messages({
    'string.min': 'Le contenu doit contenir au moins 20 caractères',
    'any.required': 'Le contenu est obligatoire',
  }),
  summary: Joi.string().max(500).optional().allow(''),
  tags: Joi.array().items(Joi.string()).optional(),
  category: Joi.string()
    .valid('tech', 'science', 'sport', 'culture', 'politique', 'autre')
    .optional(),
  status: Joi.string().valid('draft', 'published').optional(),
});

const updateArticleSchema = Joi.object({
  title: Joi.string().min(5).max(150).optional(),
  content: Joi.string().min(20).optional(),
  summary: Joi.string().max(500).optional().allow(''),
  tags: Joi.array().items(Joi.string()).optional(),
  category: Joi.string()
    .valid('tech', 'science', 'sport', 'culture', 'politique', 'autre')
    .optional(),
  status: Joi.string().valid('draft', 'published').optional(),
});

// ─────────────────────────────────────────────
// VALIDATORS COMMENT
// ─────────────────────────────────────────────

const createCommentSchema = Joi.object({
  content: Joi.string().min(2).max(1000).required().messages({
    'string.min': 'Le commentaire doit contenir au moins 2 caractères',
    'string.max': 'Le commentaire ne peut pas dépasser 1000 caractères',
    'any.required': 'Le contenu du commentaire est obligatoire',
  }),
  parentComment: Joi.string().optional(), // ID du commentaire parent (réponse)
});

const updateCommentSchema = Joi.object({
  content: Joi.string().min(2).max(1000).required().messages({
    'string.min': 'Le commentaire doit contenir au moins 2 caractères',
    'any.required': 'Le contenu est obligatoire',
  }),
});

// ─────────────────────────────────────────────
// MIDDLEWARE FACTORY
// ─────────────────────────────────────────────

/**
 * Crée un middleware de validation Joi
 * @param {Object} schema - Schema Joi
 * @param {string} target - 'body' | 'query' | 'params'
 */
const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[target], { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message).join(', ');
      return res.status(400).json({ success: false, message: messages });
    }
    next();
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createArticleSchema,
  updateArticleSchema,
  createCommentSchema,
  updateCommentSchema,
};
