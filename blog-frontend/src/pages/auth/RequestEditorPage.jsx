import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RequestEditorPage() {
  const { requestEditorRole, user } = useAuth();
  const navigate = useNavigate();
  const [profession, setProfession] = useState(user?.profession || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Already editor or admin
  if (user?.role === "editor" || user?.role === "admin") {
    return (
      <div className="container mt-5 text-center">
        <h4>
          ✅ Vous avez déjà le rôle <strong>{user.role}</strong>.
        </h4>
      </div>
    );
  }

  // Already requested
  if (user?.editorRequest?.requested) {
    return (
      <div className="container mt-5 text-center">
        <h4>⏳ Votre demande est en cours de traitement.</h4>
        <p className="text-muted">
          Un administrateur va l'examiner prochainement.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await requestEditorRole(profession);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mt-5 text-center">
        <h4>✅ Demande envoyée avec succès !</h4>
        <p className="text-muted">Redirection en cours...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 480 }}>
      <h2 className="mb-4">Devenir Éditeur</h2>
      <p className="text-muted mb-4">
        Indiquez votre profession et soumettez votre demande. Un administrateur
        l'examinera et vous notifiera.
      </p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            Profession <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="ex: Médecin, Avocat, Ingénieur..."
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "Envoyer la demande"}
        </button>
      </form>
    </div>
  );
}
