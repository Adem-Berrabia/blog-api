import { Link } from "react-router-dom";
import { Avatar } from "../ui";
import { formatDate, categoryColor, categoryLabel } from "../../utils/helpers";

export default function ArticleCard({ article }) {
  const color = categoryColor(article.category);
  const label = categoryLabel(article.category);

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden article-card">
      <div className={`bg-${color}`} style={{ height: 4 }} />
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <span
            className={`badge bg-${color} bg-opacity-15 text-${color} border border-${color} border-opacity-25`}
          >
            {label}
          </span>
          <span className="text-muted small ms-auto">
            {formatDate(article.createdAt || article.date)}
          </span>
        </div>
        <h5 className="fw-bold mb-2 lh-sm">
          <Link
            to={`/articles/${article._id}`}
            className="text-decoration-none text-dark stretched-link"
          >
            {article.title}
          </Link>
        </h5>
        <p className="text-muted small lh-relaxed mb-3 line-clamp-3">
          {article.summary || article.excerpt || article.content?.slice(0, 120)}
        </p>
        <div className="d-flex flex-wrap gap-1">
          {article.tags?.map((tag) => (
            <span
              key={tag}
              className="badge bg-light text-secondary border"
              style={{ fontSize: 11 }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="card-footer bg-transparent border-top px-4 pb-3 pt-2">
        <div className="d-flex align-items-center justify-content-between">
          <Link
            to={`/profile/${article.author?._id || article.author}`}
            className="d-flex align-items-center gap-2 text-decoration-none text-dark"
            style={{ zIndex: 1, position: "relative" }}
          >
            <Avatar user={article.author} size={28} />
            <span className="small fw-semibold">
              {article.author?.name || "Anonyme"}
            </span>
          </Link>
          <div className="d-flex gap-3 text-muted small">
            <span>❤️ {article.likes || 0}</span>
            <span>💬 {article.commentsCount || 0}</span>
            <span>👁️ {article.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
