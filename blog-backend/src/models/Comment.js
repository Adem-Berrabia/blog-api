const mongoose = require('mongoose');

/**
 * Modèle Comment
 * Champs : content, author, article, parentComment (pour les réponses imbriquées)
 */
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Le contenu du commentaire est obligatoire'],
      trim: true,
      minlength: [2, 'Le commentaire doit contenir au moins 2 caractères'],
      maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "L'auteur est obligatoire"],
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: [true, "L'article est obligatoire"],
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // null = commentaire racine, sinon = réponse
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual : réponses à un commentaire
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
});

// Index pour les requêtes fréquentes
commentSchema.index({ article: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

module.exports = mongoose.model('Comment', commentSchema);
