import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { usersAPI, articlesAPI, adminAPI } from "../../api/services";
import { useArticles } from "../../hooks/useData";
import { Avatar, Spinner, Pagination } from "../../components/ui";
import { formatDate } from "../../utils/helpers";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

// ─── Helpers ───────────────────────────────────────────────────
// const RoleBadge = ({ role }) => {
//   const map = {
//     admin: "bg-danger",
//     editor: "bg-primary",
//     user: "bg-secondary",
//   };
//   return <span className={`badge ${map[role] || "bg-secondary"}`}>{role}</span>;
// };

// const StatusBadge = ({ status }) => {
//   const map = {
//     active: "bg-success",
//     pending: "bg-warning text-dark",
//     suspended: "bg-danger",
//   };
//   return (
//     <span className={`badge ${map[status] || "bg-secondary"}`}>{status}</span>
//   );
// };

const COLORS = [
  "#0d6efd",
  "#198754",
  "#ffc107",
  "#dc3545",
  "#0dcaf0",
  "#6f42c1",
];

// ─── Analytics helpers ─────────────────────────────────────────
const getArticlesByCategory = (articles) => {
  const map = {};
  articles.forEach((a) => {
    const cat = a.category || "Autre";
    map[cat] = (map[cat] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
};

const getArticlesByMonth = (articles) => {
  const map = {};
  articles.forEach((a) => {
    const month = new Date(a.createdAt).toLocaleString("fr-FR", {
      month: "short",
      year: "2-digit",
    });
    map[month] = (map[month] || 0) + 1;
  });
  return Object.entries(map).map(([month, articles]) => ({ month, articles }));
};

const getUsersByRole = (users) => [
  {
    name: "Utilisateurs",
    value: users.filter((u) => u.role === "user").length,
  },
  { name: "Éditeurs", value: users.filter((u) => u.role === "editor").length },
  { name: "Admins", value: users.filter((u) => u.role === "admin").length },
];

const getUserGrowth = (users) => {
  const map = {};
  users.forEach((u) => {
    const month = new Date(u.createdAt).toLocaleString("fr-FR", {
      month: "short",
      year: "2-digit",
    });
    map[month] = (map[month] || 0) + 1;
  });
  return Object.entries(map).map(([month, users]) => ({ month, users }));
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");

  const [users, setUsers] = useState([]);
  const [uLoading, setULoad] = useState(true);
  const [editorReqs, setEditorReqs] = useState([]);
  const [reqLoading, setReqLoading] = useState(true);

  const [artPage, setArtPage] = useState(1);
  const {
    articles,
    pagination,
    loading: artLoading,
    refetch,
  } = useArticles({ page: artPage, limit: 8 });

  // ─── All articles for analytics (no pagination) ───────────────
  const [allArticles, setAllArticles] = useState([]);
  useEffect(() => {
    articlesAPI
      .getAll({ limit: 1000 })
      .then((res) => {
        const d = res.data?.data || res.data;
        setAllArticles(
          Array.isArray(d.articles)
            ? d.articles
            : Array.isArray(d.data)
              ? d.data
              : [],
        );
      })
      .catch(() => setAllArticles([]));
  }, []);

  const fetchUsers = useCallback(() => {
    setULoad(true);
    adminAPI
      .getAllUsers()
      .then((res) => setUsers(res.data.data || []))
      .catch(() => setUsers([]))
      .finally(() => setULoad(false));
  }, []);

  const fetchEditorRequests = useCallback(() => {
    setReqLoading(true);
    adminAPI
      .getEditorRequests()
      .then((res) => setEditorReqs(res.data.data || []))
      .catch(() => setEditorReqs([]))
      .finally(() => setReqLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchEditorRequests();
  }, [fetchUsers, fetchEditorRequests]);

  // ─── Analytics data ────────────────────────────────────────────
  const categoryData = useMemo(
    () => getArticlesByCategory(allArticles),
    [allArticles],
  );
  const monthlyData = useMemo(
    () => getArticlesByMonth(allArticles),
    [allArticles],
  );
  const roleData = useMemo(() => getUsersByRole(users), [users]);
  const growthData = useMemo(() => getUserGrowth(users), [users]);

  // ─── Actions ──────────────────────────────────────────────────
  const deleteArticle = async (id) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    await articlesAPI.delete(id);
    refetch({ page: artPage, limit: 8 });
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    await usersAPI.delete(id);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await adminAPI.changeUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u)),
      );
    } catch {
      alert("Erreur lors du changement de rôle.");
    }
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await adminAPI.changeUserStatus(userId, status);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status } : u)),
      );
    } catch {
      alert("Erreur lors du changement de statut.");
    }
  };

  const handleEditorRequest = async (userId, approve) => {
    try {
      await adminAPI.handleEditorRequest(userId, approve);
      setEditorReqs((prev) => prev.filter((u) => u._id !== userId));
      fetchUsers();
    } catch {
      alert("Erreur lors du traitement de la demande.");
    }
  };

  const TABS = [
    ["overview", "Vue d'ensemble"],
    ["analytics", "📊 Analytiques"], // ✅ new
    ["articles", "Articles"],
    ["users", "Utilisateurs"],
    [
      "requests",
      `Demandes ${editorReqs.length > 0 ? `(${editorReqs.length})` : ""}`,
    ],
  ];

  return (
    <div className="min-vh-100 bg-light">
      <div className="bg-dark text-white py-4">
        <div className="container">
          <h2 className="fw-bold mb-0">⚙️ Dashboard Admin</h2>
          <p className="text-muted small mb-0">
            Gestion de la plateforme DevBlog
          </p>
        </div>
      </div>

      <div className="container py-4">
        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            ["📝", "Articles", pagination.total, "primary"],
            ["👥", "Utilisateurs", users.length, "success"],
            [
              "✏️",
              "Éditeurs",
              users.filter((u) => u.role === "editor").length,
              "info",
            ],
            ["⏳", "En attente", editorReqs.length, "warning"],
          ].map(([icon, label, val, color]) => (
            <div key={label} className="col-6 col-md-3">
              <div
                className={`card border-0 shadow-sm rounded-4 border-top border-3 border-${color}`}
              >
                <div className="card-body text-center p-3">
                  <div style={{ fontSize: 28 }}>{icon}</div>
                  <div className="fw-bold fs-4">{val ?? 0}</div>
                  <div className="text-muted small">{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          {TABS.map(([key, label]) => (
            <li key={key} className="nav-item">
              <button
                className={`nav-link ${tab === key ? "active fw-semibold" : "text-muted"}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Articles récents</h6>
              {artLoading ? (
                <Spinner center />
              ) : (
                articles.slice(0, 5).map((a, i) => (
                  <div
                    key={a._id}
                    className="d-flex align-items-center gap-3 p-2 rounded-3"
                  >
                    <span
                      className="fw-bold text-muted"
                      style={{ minWidth: 20 }}
                    >
                      #{i + 1}
                    </span>
                    <div className="flex-grow-1">
                      <Link
                        to={`/articles/${a._id}`}
                        className="fw-semibold small text-decoration-none text-dark"
                      >
                        {a.title}
                      </Link>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        {a.category} · {formatDate(a.createdAt)}
                      </div>
                    </div>
                    <span className="text-muted small">👁️ {a.views || 0}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ✅ ── Analytics ── */}
        {tab === "analytics" && (
          <div className="row g-4">
            {/* Articles par catégorie — Pie */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-4">📂 Articles par catégorie</h6>
                  {categoryData.length === 0 ? (
                    <p className="text-muted text-center py-4">Aucune donnée</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {categoryData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Répartition des rôles — Pie */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-4">👥 Répartition des rôles</h6>
                  {users.length === 0 ? (
                    <p className="text-muted text-center py-4">Aucune donnée</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={roleData}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {roleData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Articles par mois — Bar */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-4">📅 Articles publiés par mois</h6>
                  {monthlyData.length === 0 ? (
                    <p className="text-muted text-center py-4">Aucune donnée</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar
                          dataKey="articles"
                          fill="#0d6efd"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Croissance utilisateurs — Line */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-4">
                    📈 Croissance des utilisateurs
                  </h6>
                  {growthData.length === 0 ? (
                    <p className="text-muted text-center py-4">Aucune donnée</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="#198754"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Articles ── */}
        {tab === "articles" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center px-4 py-3">
              <h6 className="fw-bold mb-0">Tous les articles</h6>
              <Link
                to="/articles/new"
                className="btn btn-warning btn-sm text-dark fw-semibold"
              >
                + Nouvel article
              </Link>
            </div>
            {artLoading ? (
              <Spinner center />
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Titre</th>
                        <th>Catégorie</th>
                        <th>Auteur</th>
                        <th>Date</th>
                        <th>Vues</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((a) => (
                        <tr key={a._id}>
                          <td className="ps-4">
                            <Link
                              to={`/articles/${a._id}`}
                              className="fw-semibold small text-decoration-none text-dark"
                            >
                              {a.title}
                            </Link>
                          </td>
                          <td>
                            <span className="badge bg-light text-secondary border">
                              {a.category}
                            </span>
                          </td>
                          <td>
                            <span className="small">
                              {a.author?.name || "—"}
                            </span>
                          </td>
                          <td>
                            <span className="small text-muted">
                              {formatDate(a.createdAt)}
                            </span>
                          </td>
                          <td>
                            <span className="small">{a.views || 0}</span>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Link
                                to={`/articles/${a._id}/edit`}
                                className="btn btn-outline-secondary btn-sm"
                              >
                                ✏️
                              </Link>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteArticle(a._id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-3">
                  <Pagination
                    current={artPage}
                    total={pagination.totalPages}
                    onChange={setArtPage}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Users ── */}
        {tab === "users" && (
          <div className="card border-0 shadow-sm rounded-4">
            {uLoading ? (
              <Spinner center />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Utilisateur</th>
                      <th>Email</th>
                      <th>Profession</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>Inscrit le</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-2">
                            <Avatar user={u} size={32} />
                            <span className="fw-semibold small">{u.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="small text-muted">{u.email}</span>
                        </td>
                        <td>
                          <span className="small text-muted">
                            {u.profession || "—"}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm w-auto"
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                          >
                            <option value="user">user</option>
                            <option value="editor">editor</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm w-auto"
                            value={u.status || "active"}
                            onChange={(e) =>
                              handleStatusChange(u._id, e.target.value)
                            }
                          >
                            <option value="active">active</option>
                            <option value="pending">pending</option>
                            <option value="suspended">suspended</option>
                          </select>
                        </td>
                        <td>
                          <span className="small text-muted">
                            {formatDate(u.createdAt)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteUser(u._id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Editor Requests ── */}
        {tab === "requests" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-transparent px-4 py-3">
              <h6 className="fw-bold mb-0">⏳ Demandes de rôle Éditeur</h6>
            </div>
            {reqLoading ? (
              <Spinner center />
            ) : editorReqs.length === 0 ? (
              <div className="text-center text-muted py-5">
                <div style={{ fontSize: 40 }}>✅</div>
                <p className="mt-2">Aucune demande en attente.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Utilisateur</th>
                      <th>Email</th>
                      <th>Profession</th>
                      <th>Demande le</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editorReqs.map((u) => (
                      <tr key={u._id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-2">
                            <Avatar user={u} size={32} />
                            <span className="fw-semibold small">{u.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="small text-muted">{u.email}</span>
                        </td>
                        <td>
                          <span className="small">{u.profession || "—"}</span>
                        </td>
                        <td>
                          <span className="small text-muted">
                            {formatDate(u.editorRequest?.requestedAt)}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleEditorRequest(u._id, true)}
                            >
                              ✅ Approuver
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleEditorRequest(u._id, false)}
                            >
                              ❌ Rejeter
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
