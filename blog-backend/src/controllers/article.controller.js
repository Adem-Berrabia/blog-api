const articleService = require('../services/article.service');

/**
 * GET /api/articles
 */
const getAllArticles = async (req, res, next) => {
  try {
    const result = await articleService.getAllArticles(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/articles/:id
 */
const getArticle = async (req, res, next) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/articles
 */
const createArticle = async (req, res, next) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const article = await articleService.createArticle(
      req.body,
      req.user._id,
      imagePath
    );
    res.status(201).json({
      success: true,
      message: 'Article créé avec succès.',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/articles/:id
 */
const updateArticle = async (req, res, next) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const article = await articleService.updateArticle(
      req.params.id,
      req.body,
      req.user._id.toString(),
      req.user.role,
      imagePath
    );
    res.status(200).json({
      success: true,
      message: 'Article mis à jour.',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/articles/:id
 */
const deleteArticle = async (req, res, next) => {
  try {
    await articleService.deleteArticle(
      req.params.id,
      req.user._id.toString(),
      req.user.role
    );
    res.status(200).json({ success: true, message: 'Article supprimé.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:userId/articles
 */
const getUserArticles = async (req, res, next) => {
  try {
    const result = await articleService.getArticlesByUser(
      req.params.userId,
      req.query
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getUserArticles,
};
