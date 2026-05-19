require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");
const commentRoutes = require("./routes/comment.routes");
const { errorHandler, notFound } = require("./middlewares/error.middleware");

const app = express();

// ── Connexion MongoDB ─────────────────────────
connectDB();

// ── Middlewares globaux ───────────────────────

// Sécurité HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Logger HTTP
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Servir les fichiers uploadés avec CORS header
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(process.cwd(), "uploads")),
);

// Rate limiting : 100 requêtes par 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Trop de requêtes. Réessayez dans 15 minutes.",
  },
});
app.use("/api", limiter);

// ── Documentation Swagger ─────────────────────
try {
  const swaggerDocument = YAML.load(
    path.join(__dirname, "../docs/swagger.yaml"),
  );
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.warn("⚠️  Swagger YAML non chargé :", e.message);
}

// ── Routes API ────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);

// Route de santé
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Blog API opérationnelle 🚀",
    timestamp: new Date().toISOString(),
  });
});

// ── Gestion des erreurs ───────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Démarrage du serveur ──────────────────────
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 Swagger : http://localhost:${PORT}/api/docs`);
    console.log(`🌍 Environnement : ${process.env.NODE_ENV}`);
  });
}

module.exports = app;
