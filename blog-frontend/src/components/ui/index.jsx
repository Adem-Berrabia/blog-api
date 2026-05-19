import { avatarUrl, initials } from "../../utils/helpers";

export function Avatar({ user, size = 36 }) {
  const src = avatarUrl(user?.avatar);
  const label = initials(user?.name || "?");
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.35,
    flexShrink: 0,
  };

  if (src)
    return (
      <img
        src={src}
        alt={label}
        className="rounded-circle object-fit-cover"
        style={style}
      />
    );

  return (
    <div
      className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold"
      style={style}
    >
      {label}
    </div>
  );
}

export function Spinner({ center = false }) {
  const el = (
    <div className="spinner-border text-warning" role="status">
      <span className="visually-hidden">Chargement…</span>
    </div>
  );
  return center ? (
    <div className="d-flex justify-content-center py-5">{el}</div>
  ) : (
    el
  );
}

export function ErrorAlert({ message }) {
  if (!message) return null;
  return <div className="alert alert-danger py-2 small">{message}</div>;
}

export function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  return (
    <nav>
      <ul className="pagination justify-content-center mb-0">
        <li className={`page-item ${current === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(current - 1)}>
            ‹
          </button>
        </li>
        {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
          <li key={p} className={`page-item ${p === current ? "active" : ""}`}>
            <button className="page-link" onClick={() => onChange(p)}>
              {p}
            </button>
          </li>
        ))}
        <li className={`page-item ${current === total ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(current + 1)}>
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function EmptyState({ icon = "🔍", message = "Aucun résultat" }) {
  return (
    <div className="text-center py-5 text-muted">
      <div style={{ fontSize: 48 }}>{icon}</div>
      <p className="mt-2">{message}</p>
    </div>
  );
}
