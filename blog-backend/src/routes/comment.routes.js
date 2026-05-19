const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate, updateCommentSchema } = require('../validators');

// PUT /api/comments/:id    → modifier un commentaire (auteur/admin)
// DELETE /api/comments/:id → supprimer un commentaire (auteur/admin)

router
  .route('/:id')
  .put(protect, validate(updateCommentSchema), commentController.updateComment)
  .delete(protect, commentController.deleteComment);

module.exports = router;
