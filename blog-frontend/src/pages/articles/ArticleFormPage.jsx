import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { articlesAPI } from "../../api/services";
import { ErrorAlert, Spinner } from "../../components/ui";
import { CATEGORIES } from "../../utils/helpers";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const EMPTY = { title: "", summary: "", content: "", category: "", tags: "" };

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  ["blockquote", "code-block"],
  ["link", "image"],
  ["clean"],
];

export default function ArticleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    articlesAPI
      .getOne(id)
      .then((res) => {
        const a = res.data.data || res.data.article || res.data;
        setForm({
          title: a.title,
          summary: a.summary || a.excerpt || "",
          content: a.content,
          category: a.category || "",
          tags: (a.tags || []).join(", "),
        });
      })
      .catch(() => setError("Impossible de charger l'article."))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      ...form,
      status: "published",
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (isEdit) await articlesAPI.update(id, payload);
      else await articlesAPI.create(payload);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner center />;

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4" style={{ maxWidth: 720 }}>
        <h2 className="fw-bold mb-4">
          {isEdit ? "✏️ Modifier l'article" : "✍️ Nouvel article"}
        </h2>
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <ErrorAlert message={error} />
            <form onSubmit={handle}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Titre *</label>
                <input
                  className="form-control"
                  placeholder="Titre de l'article"
                  value={form.title}
                  onChange={set("title")}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Extrait</label>
                <input
                  className="form-control"
                  placeholder="Description courte pour le feed"
                  value={form.summary}
                  onChange={set("summary")}
                />
              </div>

              {/* ✅ React Quill rich text editor */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  Contenu *
                </label>
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(value) => setForm({ ...form, content: value })}
                  modules={{ toolbar: TOOLBAR }}
                  placeholder="Rédigez votre article ici…"
                  style={{ borderRadius: 8, background: "white" }}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">
                    Catégorie
                  </label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={set("category")}
                  >
                    <option value="">-- Choisir --</option>
                    {CATEGORIES.filter((c) => c.value !== "").map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">
                    Tags{" "}
                    <span className="text-muted fw-normal">
                      (séparés par virgules)
                    </span>
                  </label>
                  <input
                    className="form-control"
                    placeholder="React, JavaScript, API"
                    value={form.tags}
                    onChange={set("tags")}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Annuler
                </button>
                <button
                  className="btn btn-warning text-dark fw-semibold"
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm me-2" />
                  )}
                  {isEdit ? "Enregistrer" : "Publier l'article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
