import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ErrorAlert } from "../../components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Email ou mot de passe incorrect.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center auth-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="display-5 mb-2">✦</div>
                  <h2 className="fw-bold">Connexion</h2>
                  <p className="text-muted small">
                    Accédez à votre compte DevBlog
                  </p>
                </div>
                <ErrorAlert message={error} />
                <form onSubmit={handle}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="vous@exemple.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold small">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button
                    className="btn btn-warning w-100 fw-semibold text-dark"
                    disabled={loading}
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm me-2" />
                    )}
                    {loading ? "Connexion…" : "Se connecter"}
                  </button>
                </form>
                <p className="text-center mt-3 small text-muted">
                  Pas de compte ?{" "}
                  <Link
                    to="/register"
                    className="text-warning fw-semibold text-decoration-none"
                  >
                    S'inscrire
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
