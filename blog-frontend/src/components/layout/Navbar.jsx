import { useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui";

export default function Navbar() {
  const { user, logout, isAdmin, isEditor, updateAvatar } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const active = (path) => (pathname === path ? "active text-warning" : "");

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await updateAvatar(file);
    } catch (err) {
      console.error("Avatar upload error:", err.response?.data || err.message);
      alert("Erreur: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <span className="text-warning">✦</span> DevBlog
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${active("/")}`} to="/">
                Articles
              </Link>
            </li>

            {(isAdmin || isEditor) && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${active("/articles/new")}`}
                  to="/articles/new"
                >
                  + Nouvel article
                </Link>
              </li>
            )}

            {isAdmin && (
              <li className="nav-item">
                <Link className={`nav-link ${active("/admin")}`} to="/admin">
                  <span
                    className="badge bg-warning text-dark me-1"
                    style={{ fontSize: 10 }}
                  >
                    ADMIN
                  </span>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-link text-decoration-none text-light d-flex align-items-center gap-2"
                  data-bs-toggle="dropdown"
                >
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAvatarClick();
                    }}
                    title="Changer l'avatar"
                    style={{ cursor: "pointer" }}
                  >
                    <Avatar user={user} size={34} />
                  </span>
                  <span className="d-none d-md-inline small">{user.name}</span>
                  {isAdmin && (
                    <span className="badge bg-danger" style={{ fontSize: 9 }}>
                      ADMIN
                    </span>
                  )}
                  {isEditor && (
                    <span className="badge bg-primary" style={{ fontSize: 9 }}>
                      ÉDITEUR
                    </span>
                  )}
                  <span>▾</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleFileChange}
                />

                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li>
                    <span className="dropdown-item-text small text-muted">
                      {user.email}
                    </span>
                  </li>
                  {isEditor && user.profession && (
                    <li>
                      <span className="dropdown-item-text small text-muted fst-italic">
                        {user.profession}
                      </span>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider my-1" />
                  </li>

                  {!isAdmin && !isEditor && (
                    <>
                      {user.editorRequest?.requested ? (
                        <li>
                          <span className="dropdown-item-text small text-warning">
                            ⏳ Demande en attente...
                          </span>
                        </li>
                      ) : (
                        <li>
                          <Link
                            className="dropdown-item small"
                            to="/request-editor"
                          >
                            ✏️ Devenir Éditeur
                          </Link>
                        </li>
                      )}
                      <li>
                        <hr className="dropdown-divider my-1" />
                      </li>
                    </>
                  )}

                  <li>
                    <button
                      className="dropdown-item text-danger small"
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Connexion
                </Link>
                <Link
                  className="btn btn-warning btn-sm text-dark fw-semibold"
                  to="/register"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
