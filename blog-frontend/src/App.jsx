import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import FeedPage from "./pages/articles/FeedPage";
import ArticleDetailPage from "./pages/articles/ArticleDetailPage";
import ArticleFormPage from "./pages/articles/ArticleFormPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import RequestEditorPage from "./pages/auth/RequestEditorPage";
import ProfilePage from "./pages/profile/ProfilePage";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* ─── Public ───────────────────────────────────────── */}
          <Route path="/" element={<FeedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />

          {/* ─── Logged in users ──────────────────────────────── */}
          <Route
            element={<ProtectedRoute roles={["user", "editor", "admin"]} />}
          >
            <Route path="/request-editor" element={<RequestEditorPage />} />
          </Route>

          {/* ─── Editor + Admin ───────────────────────────────── */}
          <Route element={<ProtectedRoute roles={["editor", "admin"]} />}>
            <Route path="/articles/new" element={<ArticleFormPage />} />
            <Route path="/articles/:id/edit" element={<ArticleFormPage />} />
          </Route>

          {/* ─── Admin only ───────────────────────────────────── */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
