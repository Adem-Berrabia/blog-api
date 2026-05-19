const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Modèle User
 * Champs : name, email, password, role, avatar, bio, status, profession, editorRequest
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
      minlength: [2, "Le nom doit contenir au moins 2 caractères"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Format d'email invalide"],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "editor", "admin"], // ✅ added 'editor'
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "pending", "suspended"], // ✅ new
      default: "active",
    },
    profession: {
      type: String,
      trim: true,
      maxlength: [100, "La profession ne peut pas dépasser 100 caractères"],
      default: null, // ✅ new — e.g. "Doctor", "Lawyer", "Engineer"
    },
    editorRequest: {
      requested: { type: Boolean, default: false }, // ✅ new — user asked to be editor
      requestedAt: { type: Date, default: null }, // when they requested
      rejectedAt: { type: Date, default: null }, // if admin rejected
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [300, "La bio ne peut pas dépasser 300 caractères"],
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual : articles de l'utilisateur
userSchema.virtual("articles", {
  ref: "Article",
  localField: "_id",
  foreignField: "author",
});

// ✅ Virtual : check if user is admin
userSchema.virtual("isAdmin").get(function () {
  return this.role === "admin";
});

// ✅ Virtual : check if user is editor
userSchema.virtual("isEditor").get(function () {
  return this.role === "editor";
});

// ✅ Virtual : check if editor request is pending
userSchema.virtual("hasPendingRequest").get(function () {
  return this.editorRequest?.requested === true;
});

// Middleware pre-save : hashage du mot de passe
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode : vérifier le mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ✅ Méthode : demander le rôle éditeur
userSchema.methods.requestEditorRole = function (profession) {
  this.editorRequest.requested = true;
  this.editorRequest.requestedAt = new Date();
  this.editorRequest.rejectedAt = null;
  if (profession) this.profession = profession;
};

// ✅ Méthode : approuver comme éditeur
userSchema.methods.approveAsEditor = function () {
  this.role = "editor";
  this.status = "active";
  this.editorRequest.requested = false;
  this.editorRequest.requestedAt = null;
};

// ✅ Méthode : rejeter la demande éditeur
userSchema.methods.rejectEditorRequest = function () {
  this.editorRequest.requested = false;
  this.editorRequest.rejectedAt = new Date();
};

module.exports = mongoose.model("User", userSchema);
