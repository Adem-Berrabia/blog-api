import api from "./axios";

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  updateMe: (data) => api.put("/auth/me", data),
  uploadAvatar: (formData) =>
    api.put("/auth/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  requestEditor: (data) => api.post("/auth/request-editor", data),
};

export const articlesAPI = {
  getAll: (params) => api.get("/articles", { params }),
  getOne: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post("/articles", data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};

export const commentsAPI = {
  getByArticle: (articleId) => api.get(`/articles/${articleId}/comments`),
  create: (articleId, data) =>
    api.post(`/articles/${articleId}/comments`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

export const usersAPI = {
  getAll: (params) => api.get("/users", { params }),
  getOne: (id) => api.get(`/auth/users/${id}`), // ✅ fixed
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const adminAPI = {
  getAllUsers: () => api.get("/auth/admin/users"),
  changeUserRole: (id, role) =>
    api.put(`/auth/admin/users/${id}/role`, { role }),
  changeUserStatus: (id, status) =>
    api.put(`/auth/admin/users/${id}/status`, { status }),
  getEditorRequests: () => api.get("/auth/admin/editor-requests"),
  handleEditorRequest: (id, approve) =>
    api.put(`/auth/admin/editor-requests/${id}`, { approve }),
};
