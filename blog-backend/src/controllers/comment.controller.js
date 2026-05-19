const commentService = require('../services/comment.service');

/**
 * POST /api/articles/:articleId/comments
 */
const createComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(
      req.params.articleId,
      req.body,
      req.user._id
    );
    res.status(201).json({
      success: true,
      message: 'Commentaire ajouté.',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/articles/:articleId/comments
 */
const getComments = async (req, res, next) => {
  try {
    const result = await commentService.getCommentsByArticle(
      req.params.articleId,
      req.query
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/comments/:id
 */
const updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.updateComment(
      req.params.id,
      req.body.content,
      req.user._id.toString(),
      req.user.role
    );
    res.status(200).json({
      success: true,
      message: 'Commentaire modifié.',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/comments/:id
 */
const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(
      req.params.id,
      req.user._id.toString(),
      req.user.role
    );
    res.status(200).json({ success: true, message: 'Commentaire supprimé.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createComment, getComments, updateComment, deleteComment };
