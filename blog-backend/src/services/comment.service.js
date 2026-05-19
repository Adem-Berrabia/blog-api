const Comment = require('../models/Comment');
const Article = require('../models/Article');

/**
 * Créer un commentaire sur un article
 */
const createComment = async (articleId, data, authorId) => {
  // Vérifier que l'article existe et est publié
  const article = await Article.findOne({ _id: articleId, status: 'published' });
  if (!article) {
    const error = new Error('Article introuvable ou non publié.');
    error.statusCode = 404;
    throw error;
  }

  // Si réponse à un commentaire, vérifier que le parent existe
  if (data.parentComment) {
    const parent = await Comment.findOne({
      _id: data.parentComment,
      article: articleId,
    });
    if (!parent) {
      const error = new Error('Commentaire parent introuvable.');
      error.statusCode = 404;
      throw error;
    }
  }

  const comment = await Comment.create({
    content: data.content,
    author: authorId,
    article: articleId,
    parentComment: data.parentComment || null,
  });

  return comment.populate('author', 'name avatar');
};

/**
 * Récupérer les commentaires d'un article (avec pagination)
 */
const getCommentsByArticle = async (articleId, query) => {
  const { page = 1, limit = 20 } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {
    article: articleId,
    parentComment: null, // Uniquement les commentaires racines
    isDeleted: false,
  };

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .populate('author', 'name avatar')
      .populate({
        path: 'replies',
        match: { isDeleted: false },
        populate: { path: 'author', select: 'name avatar' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Comment.countDocuments(filter),
  ]);

  return {
    comments,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  };
};

/**
 * Mettre à jour un commentaire
 */
const updateComment = async (commentId, content, userId, userRole) => {
  const comment = await Comment.findOne({ _id: commentId, isDeleted: false });
  if (!comment) {
    const error = new Error('Commentaire introuvable.');
    error.statusCode = 404;
    throw error;
  }

  if (comment.author.toString() !== userId && userRole !== 'admin') {
    const error = new Error("Vous n'êtes pas autorisé à modifier ce commentaire.");
    error.statusCode = 403;
    throw error;
  }

  comment.content = content;
  comment.isEdited = true;
  await comment.save();

  return comment.populate('author', 'name avatar');
};

/**
 * Supprimer un commentaire (soft delete)
 */
const deleteComment = async (commentId, userId, userRole) => {
  const comment = await Comment.findOne({ _id: commentId, isDeleted: false });
  if (!comment) {
    const error = new Error('Commentaire introuvable.');
    error.statusCode = 404;
    throw error;
  }

  if (comment.author.toString() !== userId && userRole !== 'admin') {
    const error = new Error("Vous n'êtes pas autorisé à supprimer ce commentaire.");
    error.statusCode = 403;
    throw error;
  }

  // Soft delete : on garde le commentaire mais on le marque supprimé
  comment.isDeleted = true;
  comment.content = '[Commentaire supprimé]';
  await comment.save();

  return true;
};

module.exports = {
  createComment,
  getCommentsByArticle,
  updateComment,
  deleteComment,
};
