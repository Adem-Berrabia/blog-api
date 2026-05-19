import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usersAPI, articlesAPI } from "../../api/services";
import { Avatar, Spinner, EmptyState } from "../../components/ui";
import ArticleCard from "../../components/ui/ArticleCard";
import { formatDate } from "../../utils/helpers";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      usersAPI.getOne(id),
      articlesAPI.getAll({ author: id, limit: 20 }),
    ])
      .then(([userRes, artRes]) => {
        setUser(userRes.data.data || userRes.data);
        const d = artRes.data?.data || artRes.data;
        setArticles(
          Array.isArray(d.articles)
            ? d.articles
            : Array.isArray(d.data)
              ? d.data
              : Array.isArray(d)
                ? d
                : [],
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner center />;
  if (!user) return <EmptyState icon="👤" message="Utilisateur introuvable." />;

  const isEditor = user.role === "editor";
  const isAdmin = user.role === "admin";

  return (
    <div className="min-vh-100 bg-light">
      {/* ── Hero banner ── */}
      <div
        className="bg-dark text-white py-5"
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">
            {/* Avatar */}
            <div className="position-relative">
              <Avatar user={user} size={110} />
              {(isEditor || isAdmin) && (
                <span
                  className="position-absolute bottom-0 end-0 badge rounded-pill bg-warning text-dark"
                  style={{ fontSize: 11, border: "2px solid #1a1a2e" }}
                >
                  {isAdmin ? "Admin" : "Éditeur"}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="text-center text-md-start flex-grow-1">
              <h2 className="fw-bold mb-1">{user.name}</h2>

              {isEditor && user.profession && (
                <p className="text-warning mb-1" style={{ fontSize: 15 }}>
                  💼 {user.profession}
                </p>
              )}

              {user.bio && (
                <p className="text-white-50 mb-2" style={{ maxWidth: 500 }}>
                  {user.bio}
                </p>
              )}

              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mt-2">
                <span className="text-white-50 small">
                  📅 Membre depuis {formatDate(user.createdAt)}
                </span>
                <span className="text-white-50 small">
                  📝 {articles.length} article{articles.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-3">
                {isAdmin && <span className="badge bg-danger me-2">Admin</span>}
                {isEditor && (
                  <span className="badge bg-primary me-2">Éditeur</span>
                )}
                {!isAdmin && !isEditor && (
                  <span className="badge bg-secondary">Membre</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="bg-white border-bottom shadow-sm">
        <div className="container">
          <div className="row text-center py-3">
            {[
              ["📝", articles.length, "Articles"],
              ["❤️", articles.reduce((s, a) => s + (a.likes || 0), 0), "Likes"],
              ["👁️", articles.reduce((s, a) => s + (a.views || 0), 0), "Vues"],
              [
                "💬",
                articles.reduce((s, a) => s + (a.commentsCount || 0), 0),
                "Commentaires",
              ],
            ].map(([icon, val, label]) => (
              <div key={label} className="col-6 col-md-3 py-2">
                <div className="fw-bold fs-5">
                  {icon} {val}
                </div>
                <div className="text-muted small">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Articles ── */}
      <div className="container py-5">
        <h5 className="fw-bold mb-4">Articles de {user.name}</h5>

        {articles.length === 0 ? (
          <EmptyState
            icon="📭"
            message="Aucun article publié pour l'instant."
          />
        ) : (
          <div className="row g-4">
            {articles.map((a) => (
              <div key={a._id} className="col-md-6 col-lg-4">
                <ArticleCard article={a} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
