import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useArticle, useComments } from "../../hooks/useData";
import { articlesAPI } from "../../api/services";
import { Avatar, Spinner } from "../../components/ui";
import { formatDate, categoryColor, categoryLabel } from "../../utils/helpers";
import "react-quill-new/dist/quill.snow.css";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { article, loading, error } = useArticle(id);
  const { comments, addComment, removeComment } = useComments(id);
  const [text, setText] = useState("");
  const [liked, setLiked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Supprimer cet article ?")) return;
    await articlesAPI.delete(id);
    navigate("/");
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await addComment(text);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner center />;
  if (error)
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  if (!article) return null;

  const color = categoryColor(article.category);
  const isOwner =
    user && (user._id === article.author?._id || user.role === "admin");

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4" style={{ maxWidth: 780 }}>
        <Link
          to="/"
          className="btn btn-link text-decoration-none text-muted ps-0 mb-3"
        >
          ← Retour
        </Link>

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div
            className={`bg-${color}`}
            style={{ height: 6, borderRadius: "1rem 1rem 0 0" }}
          />
          <div className="card-body p-5">
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span
                className={`badge bg-${color} bg-opacity-10 text-${color} border border-${color} border-opacity-25`}
              >
                {categoryLabel(article.category)}
              </span>
              {article.tags?.map((t) => (
                <span
                  key={t}
                  className="badge bg-light text-secondary border"
                  style={{ fontSize: 11 }}
                >
                  #{t}
                </span>
              ))}
            </div>
            <h1 className="fw-bold mb-3">{article.title}</h1>
            <div className="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom flex-wrap">
              <Avatar user={article.author} size={44} />
              <div>
                <div className="fw-semibold">
                  {article.author?.name || "Anonyme"}
                </div>
                <div className="text-muted small">
                  {formatDate(article.createdAt)}
                </div>
              </div>
              <span className="ms-auto text-muted small">
                👁️ {article.views || 0}
              </span>
              {isOwner && (
                <div className="d-flex gap-2">
                  <Link
                    to={`/articles/${id}/edit`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    ✏️ Modifier
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleDelete}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </div>

            {/* ✅ Render rich HTML content */}
            <div
              className="lh-relaxed ql-editor"
              style={{ fontSize: "1.05rem", padding: 0 }}
              dangerouslySetInnerHTML={{ __html: article.content || "" }}
            />

            <div className="d-flex align-items-center gap-3 mt-4 pt-4 border-top">
              <button
                className={`btn ${liked ? "btn-danger" : "btn-outline-danger"} btn-sm`}
                onClick={() => setLiked(!liked)}
              >
                {liked ? "❤️" : "🤍"} {(article.likes || 0) + (liked ? 1 : 0)}{" "}
                j'aime
              </button>
              <span className="text-muted small">
                💬 {comments.length} commentaire
                {comments.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">
              💬 Commentaires ({comments.length})
            </h5>
            {user ? (
              <form
                onSubmit={handleComment}
                className="d-flex gap-3 mb-4 pb-4 border-bottom"
              >
                <Avatar user={user} size={36} />
                <div className="flex-grow-1">
                  <textarea
                    className="form-control mb-2 rounded-3"
                    rows={3}
                    placeholder="Votre avis…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    className="btn btn-warning btn-sm text-dark fw-semibold"
                    disabled={!text.trim() || submitting}
                  >
                    {submitting && (
                      <span className="spinner-border spinner-border-sm me-1" />
                    )}{" "}
                    Publier
                  </button>
                </div>
              </form>
            ) : (
              <div className="alert alert-info py-2 small mb-4">
                <Link to="/login" className="fw-semibold text-decoration-none">
                  Connectez-vous
                </Link>{" "}
                pour commenter.
              </div>
            )}
            {comments.length === 0 ? (
              <p className="text-muted text-center py-3">
                Soyez le premier à commenter !
              </p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {comments.map((c) => (
                  <div key={c._id} className="d-flex gap-3">
                    <Avatar user={c.author || c.user} size={36} />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fw-semibold small">
                          {c.author?.name || c.user?.name || "Anonyme"}
                        </span>
                        <span className="text-muted" style={{ fontSize: 12 }}>
                          {formatDate(c.createdAt)}
                        </span>
                        {(user?._id === c.author?._id ||
                          user?.role === "admin") && (
                          <button
                            className="btn btn-link btn-sm text-danger p-0 ms-auto"
                            onClick={() => removeComment(c._id)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <p
                        className="mb-0 text-secondary"
                        style={{ fontSize: 14 }}
                      >
                        {c.content || c.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
