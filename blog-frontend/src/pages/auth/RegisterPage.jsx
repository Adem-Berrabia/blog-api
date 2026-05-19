import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ErrorAlert } from "../../components/ui";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 6) {
      setError("Minimum 6 caractères.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const f = (key) => ({
    value: form[key],
    onChange: (e) => {
      setForm({ ...form, [key]: e.target.value });
      setError("");
    },
  });

  return (
    <div className="min-vh-100 d-flex align-items-center auth-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="display-5 mb-2">✦</div>
                  <h2 className="fw-bold">Créer un compte</h2>
                  <p className="text-muted small">
                    Rejoignez la communauté DevBlog
                  </p>
                </div>
                <ErrorAlert message={error} />
                <form onSubmit={handle}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Nom complet
                    </label>
                    <input
                      className="form-control"
                      placeholder="Jean Dupont"
                      {...f("name")}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="vous@exemple.com"
                      {...f("email")}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Min. 6 caractères"
                      {...f("password")}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold small">
                      Confirmer
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Répétez le mot de passe"
                      {...f("confirm")}
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
                    {loading ? "Inscription…" : "Créer mon compte"}
                  </button>
                </form>
                <p className="text-center mt-3 small text-muted">
                  Déjà inscrit ?{" "}
                  <Link
                    to="/login"
                    className="text-warning fw-semibold text-decoration-none"
                  >
                    Se connecter
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
