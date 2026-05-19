const mongoose = require('mongoose');

/**
 * Modèle Article
 * Champs : title, content, summary, image, tags, category, author, status
 */
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true,
      minlength: [5, 'Le titre doit contenir au moins 5 caractères'],
      maxlength: [150, 'Le titre ne peut pas dépasser 150 caractères'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Le contenu est obligatoire'],
      minlength: [20, 'Le contenu doit contenir au moins 20 caractères'],
    },
    summary: {
      type: String,
      maxlength: [500, 'Le résumé ne peut pas dépasser 500 caractères'],
      default: '',
    },
    image: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['tech', 'science', 'sport', 'culture', 'politique', 'autre'],
      default: 'autre',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "L'auteur est obligatoire"],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual : commentaires de l'article
articleSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'article',
});

// Index pour la recherche full-text
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });
articleSchema.index({ author: 1, status: 1 });
articleSchema.index({ createdAt: -1 });

// Middleware pre-save : génération du slug
articleSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') +
      '-' +
      Date.now();
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
