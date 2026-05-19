const express = require('express');
const router = express.Router();

const articleController = require('../controllers/article.controller');
const commentController = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const {
  validate,
  createArticleSchema,
  updateArticleSchema,
  createCommentSchema,
  updateCommentSchema,
} = require('../validators');

// ── Articles ──────────────────────────────────
// GET /api/articles         → liste avec filtres + pagination (public)
// GET /api/articles/:id     → détail d'un article (public)
// POST /api/articles        → créer un article (auth requis)
// PUT /api/articles/:id     → modifier un article (auteur/admin)
// DELETE /api/articles/:id  → supprimer un article (auteur/admin)

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(
    protect,
    upload.single('image'),
    validate(createArticleSchema),
    articleController.createArticle
  );

router
  .route('/:id')
  .get(articleController.getArticle)
  .put(
    protect,
    upload.single('image'),
    validate(updateArticleSchema),
    articleController.updateArticle
  )
  .delete(protect, articleController.deleteArticle);

// ── Commentaires liés à un article ───────────
// GET  /api/articles/:articleId/comments  → liste des commentaires
// POST /api/articles/:articleId/comments  → ajouter un commentaire

router
  .route('/:articleId/comments')
  .get(commentController.getComments)
  .post(
    protect,
    validate(createCommentSchema),
    commentController.createComment
  );

module.exports = router;
