const Article = require("../models/Article");

/**
 * Récupérer tous les articles avec filtres + pagination
 */
const getAllArticles = async (query) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    author,
    search,
    tags,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const filter = {};

  // Filtre status (par défaut, public ne voit que les publiés)
  if (status) filter.status = status;
  else filter.status = "published";

  // Filtre catégorie
  if (category) filter.category = category;

  // Filtre auteur
  if (author) filter.author = author;

  // Filtre tags
  if (tags) filter.tags = { $in: tags.split(",") };

  // Recherche full-text
  if (search) filter.$text = { $search: search };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === "asc" ? 1 : -1;

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .populate("author", "name avatar")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-content"), // résumé dans la liste
    Article.countDocuments(filter),
  ]);

  return {
    articles,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  };
};

/**
 * Récupérer un article par ID ou slug
 */
const getArticleById = async (identifier) => {
  const query = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier };

  const article = await Article.findOne(query)
    .populate("author", "name avatar bio")
    .populate({
      path: "comments",
      match: { parentComment: null, isDeleted: false },
      populate: [
        { path: "author", select: "name avatar" },
        {
          path: "replies",
          match: { isDeleted: false },
          populate: { path: "author", select: "name avatar" },
        },
      ],
    });

  if (!article) {
    const error = new Error("Article introuvable.");
    error.statusCode = 404;
    throw error;
  }

  // Incrémenter les vues
  await Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } });

  return article;
};

/**
 * Créer un nouvel article
 */
const createArticle = async (data, authorId, imagePath) => {
  const articleData = { ...data, author: authorId };
  if (!articleData.status) articleData.status = "published";
  if (data.excerpt) articleData.summary = data.excerpt;
  if (imagePath) articleData.image = imagePath;

  const article = await Article.create(articleData);
  return article.populate("author", "name avatar");
};

/**
 * Mettre à jour un article (auteur ou admin)
 */
const updateArticle = async (articleId, data, userId, userRole, imagePath) => {
  const article = await Article.findById(articleId);
  if (!article) {
    const error = new Error("Article introuvable.");
    error.statusCode = 404;
    throw error;
  }

  // Vérifier les droits
  if (article.author.toString() !== userId && userRole !== "admin") {
    const error = new Error("Vous n'êtes pas autorisé à modifier cet article.");
    error.statusCode = 403;
    throw error;
  }

  const updateData = { ...data };
  if (updateData.excerpt) {
    updateData.summary = updateData.excerpt;
    delete updateData.excerpt;
  }
  if (imagePath) updateData.image = imagePath;

  const updated = await Article.findByIdAndUpdate(articleId, updateData, {
    new: true,
    runValidators: true,
  }).populate("author", "name avatar");

  return updated;
};

/**
 * Supprimer un article
 */
const deleteArticle = async (articleId, userId, userRole) => {
  const article = await Article.findById(articleId);
  if (!article) {
    const error = new Error("Article introuvable.");
    error.statusCode = 404;
    throw error;
  }

  if (article.author.toString() !== userId && userRole !== "admin") {
    const error = new Error(
      "Vous n'êtes pas autorisé à supprimer cet article.",
    );
    error.statusCode = 403;
    throw error;
  }

  await Article.findByIdAndDelete(articleId);
  return true;
};

/**
 * Récupérer les articles d'un utilisateur
 */
const getArticlesByUser = async (userId, query) => {
  const { page = 1, limit = 10, status } = query;
  const filter = { author: userId };
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Article.countDocuments(filter),
  ]);

  return {
    articles,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  };
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByUser,
};
