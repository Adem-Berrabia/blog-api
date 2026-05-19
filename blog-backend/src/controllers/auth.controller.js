const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res
      .status(201)
      .json({ success: true, message: "Inscription réussie.", data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res
      .status(200)
      .json({ success: true, message: "Connexion réussie.", data: result });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    res
      .status(200)
      .json({ success: true, message: "Profil mis à jour.", data: user });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Aucun fichier fourni." });
    }
    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await authService.updateAvatar(req.user._id, avatarPath);
    res
      .status(200)
      .json({
        success: true,
        message: "Avatar mis à jour.",
        data: { avatar: user.avatar },
      });
  } catch (error) {
    next(error);
  }
};

const requestEditor = async (req, res, next) => {
  try {
    const { profession } = req.body;
    const user = await authService.requestEditorRole(req.user._id, profession);
    res.status(200).json({
      success: true,
      message:
        "Demande envoyée. En attente de validation par un administrateur.",
      data: { editorRequest: user.editorRequest, profession: user.profession },
    });
  } catch (error) {
    next(error);
  }
};

const getEditorRequests = async (req, res, next) => {
  try {
    const users = await authService.getEditorRequests();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const handleEditorRequest = async (req, res, next) => {
  try {
    const { approve } = req.body;
    const user = await authService.handleEditorRequest(
      req.params.userId,
      approve,
    );
    res.status(200).json({
      success: true,
      message: approve
        ? "Utilisateur approuvé comme éditeur."
        : "Demande rejetée.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const changeUserRole = async (req, res, next) => {
  try {
    const user = await authService.changeUserRole(
      req.params.userId,
      req.body.role,
    );
    res
      .status(200)
      .json({
        success: true,
        message: `Rôle mis à jour : ${user.role}`,
        data: user,
      });
  } catch (error) {
    next(error);
  }
};

const changeUserStatus = async (req, res, next) => {
  try {
    const user = await authService.changeUserStatus(
      req.params.userId,
      req.body.status,
    );
    res
      .status(200)
      .json({
        success: true,
        message: `Statut mis à jour : ${user.status}`,
        data: user,
      });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// ✅ new
const getUserById = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  uploadAvatar,
  requestEditor,
  getEditorRequests,
  handleEditorRequest,
  changeUserRole,
  changeUserStatus,
  getAllUsers,
  getUserById, // ✅ new
};
