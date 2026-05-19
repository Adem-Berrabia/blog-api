const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = async ({ name, email, password, bio, profession }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Cet email est déjà utilisé.");
    error.statusCode = 409;
    throw error;
  }
  const user = await User.create({ name, email, password, bio, profession });
  const token = generateToken(user._id, user.role);
  return { token, user: formatUser(user) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.isActive) {
    const error = new Error("Email ou mot de passe incorrect.");
    error.statusCode = 401;
    throw error;
  }
  if (user.status === "suspended") {
    const error = new Error(
      "Votre compte a été suspendu. Contactez un administrateur.",
    );
    error.statusCode = 403;
    throw error;
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Email ou mot de passe incorrect.");
    error.statusCode = 401;
    throw error;
  }
  const token = generateToken(user._id, user.role);
  return { token, user: formatUser(user) };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).populate(
    "articles",
    "title slug status createdAt",
  );
  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateProfile = async (userId, updateData) => {
  const allowedFields = ["name", "bio", "profession"];
  const filteredData = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined)
      filteredData[field] = updateData[field];
  });
  const user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  });
  return user;
};

const updateAvatar = async (userId, avatarPath) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { avatar: avatarPath },
    { new: true },
  );
  return user;
};

const requestEditorRole = async (userId, profession) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    throw error;
  }
  if (user.role === "editor" || user.role === "admin") {
    const error = new Error("Vous avez déjà un rôle élevé.");
    error.statusCode = 400;
    throw error;
  }
  if (user.editorRequest.requested) {
    const error = new Error("Une demande est déjà en cours.");
    error.statusCode = 400;
    throw error;
  }
  user.requestEditorRole(profession);
  await user.save();
  return user;
};

const getEditorRequests = async () => {
  return await User.find({ "editorRequest.requested": true }).select(
    "name email profession editorRequest createdAt",
  );
};

const handleEditorRequest = async (targetUserId, approve) => {
  const user = await User.findById(targetUserId);
  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    throw error;
  }
  if (!user.editorRequest.requested) {
    const error = new Error("Aucune demande en attente pour cet utilisateur.");
    error.statusCode = 400;
    throw error;
  }
  if (approve) {
    user.approveAsEditor();
  } else {
    user.rejectEditorRequest();
  }
  await user.save();
  return user;
};

const changeUserRole = async (targetUserId, role) => {
  const validRoles = ["user", "editor", "admin"];
  if (!validRoles.includes(role)) {
    const error = new Error("Rôle invalide.");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.findByIdAndUpdate(
    targetUserId,
    { role },
    { new: true, runValidators: true },
  );
  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const changeUserStatus = async (targetUserId, status) => {
  const validStatuses = ["active", "pending", "suspended"];
  if (!validStatuses.includes(status)) {
    const error = new Error("Statut invalide.");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.findByIdAndUpdate(
    targetUserId,
    { status },
    { new: true },
  );
  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const getAllUsers = async () => {
  return await User.find().select("-password").sort({ createdAt: -1 });
};

// ✅ new
const getUserById = async (userId) => {
  const user = await User.findById(userId).select(
    "name email avatar bio role profession createdAt",
  );
  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  profession: user.profession,
  avatar: user.avatar,
  bio: user.bio,
  editorRequest: user.editorRequest,
  createdAt: user.createdAt,
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updateAvatar,
  requestEditorRole,
  getEditorRequests,
  handleEditorRequest,
  changeUserRole,
  changeUserStatus,
  getAllUsers,
  getUserById, // ✅ new
};
