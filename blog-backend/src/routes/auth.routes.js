const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const { validate, registerSchema, loginSchema } = require("../validators");

// ─── Routes publiques ───────────────────────────────────────────
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/users/:id", authController.getUserById); // ✅ new

// ─── Routes utilisateur connecté ────────────────────────────────
router.get("/me", protect, authController.getMe);
router.put("/me", protect, authController.updateMe);
router.put(
  "/me/avatar",
  protect,
  upload.single("avatar"),
  authController.uploadAvatar,
);

// ✅ Demander le rôle éditeur
router.post("/request-editor", protect, authController.requestEditor);

// ─── Routes admin ────────────────────────────────────────────────
router.get("/admin/users", protect, adminOnly, authController.getAllUsers);
router.put(
  "/admin/users/:userId/role",
  protect,
  adminOnly,
  authController.changeUserRole,
);
router.put(
  "/admin/users/:userId/status",
  protect,
  adminOnly,
  authController.changeUserStatus,
);
router.get(
  "/admin/editor-requests",
  protect,
  adminOnly,
  authController.getEditorRequests,
);
router.put(
  "/admin/editor-requests/:userId",
  protect,
  adminOnly,
  authController.handleEditorRequest,
);

module.exports = router;
