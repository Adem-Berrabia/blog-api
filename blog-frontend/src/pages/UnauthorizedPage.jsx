import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">🚫 Accès refusé</h1>
      <p className="text-muted">
        Vous n'avez pas les droits pour accéder à cette page.
      </p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Retour à l'accueil
      </button>
    </div>
  );
}
