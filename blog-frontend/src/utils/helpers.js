const BASE = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const CATEGORY_META = [
  { label: "Tous", value: "" },
  { label: "Tech", value: "tech" },
  { label: "Science", value: "science" },
  { label: "Sport", value: "sport" },
  { label: "Culture", value: "culture" },
  { label: "Politique", value: "politique" },
  { label: "Autre", value: "autre" },
];

export const avatarUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE}${path}`;
};

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const CATEGORY_COLORS = {
  tech: "primary",
  science: "success",
  sport: "info",
  culture: "secondary",
  politique: "dark",
  autre: "warning",
};

export const categoryColor = (cat) =>
  CATEGORY_COLORS[(cat || "").toString().toLowerCase()] || "secondary";

export const categoryLabel = (value) =>
  CATEGORY_META.find((c) => c.value === value)?.label || value || "Autre";

export const CATEGORIES = CATEGORY_META;
