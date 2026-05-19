import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useArticles } from "../../hooks/useData";
import ArticleCard from "../../components/ui/ArticleCard";
import { Pagination, Spinner, EmptyState } from "../../components/ui";
import { CATEGORIES } from "../../utils/helpers";

export default function FeedPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [debSearch, setDebSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { articles, pagination, loading, error } = useArticles({
    page,
    limit: 6,
    search: debSearch || undefined,
    category: category || undefined,
  });

  const handleCat = (catValue) => {
    setCategory(catValue);
    setPage(1);
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="bg-dark text-white py-5">
        <div className="container">
          <div className="row align-items-center g-3">
            <div className="col-md-7">
              <h1 className="fw-bold display-6 mb-1">
                {user ? `Bonjour, ${user.name?.split(" ")[0]} 👋` : "DevBlog"}
              </h1>
              <p className="text-light opacity-75 mb-0 small">
                Le blog des développeurs passionnés
              </p>
            </div>
            <div className="col-md-5">
              <input
                className="form-control border-0 shadow-sm"
                placeholder="🔍 Rechercher un article…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="d-flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value || cat.label}
              className={`btn btn-sm rounded-pill ${category === cat.value ? "btn-warning text-dark fw-semibold" : "btn-outline-secondary"}`}
              onClick={() => handleCat(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <Spinner center />
        ) : articles.length === 0 ? (
          <EmptyState message="Aucun article trouvé." />
        ) : (
          <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mb-4">
              {articles.map((a) => (
                <div key={a._id} className="col">
                  <ArticleCard article={a} />
                </div>
              ))}
            </div>
            <p className="text-center text-muted small mb-3">
              Page {pagination.page} sur {pagination.totalPages} ·{" "}
              {pagination.total} articles
            </p>
            <Pagination
              current={pagination.page}
              total={pagination.totalPages}
              onChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
