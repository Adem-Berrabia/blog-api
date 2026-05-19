# 📝 Blog API

API REST complète pour une **Plateforme Blog / Médias**, développée avec **Express.js** et **MongoDB**.

## 🚀 Fonctionnalités

- ✅ Authentification JWT (register / login / profil)
- ✅ CRUD complet : Articles, Commentaires, Utilisateurs
- ✅ Relations : User → Articles → Commentaires (avec réponses imbriquées)
- ✅ Filtres avancés + pagination sur les articles
- ✅ Upload d'images (avatar, image d'article)
- ✅ Validation des données avec Joi
- ✅ Sécurité : Helmet, Rate Limiting, CORS
- ✅ Documentation Swagger (OpenAPI 3.0)
- ✅ Tests unitaires avec Jest & Supertest

---

## 🏗️ Architecture

```
blog-api/
├── src/
│   ├── app.js                 # Point d'entrée
│   ├── config/
│   │   └── db.js              # Connexion MongoDB
│   ├── models/
│   │   ├── User.js
│   │   ├── Article.js
│   │   └── Comment.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── article.controller.js
│   │   └── comment.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── article.service.js
│   │   └── comment.service.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── article.routes.js
│   │   └── comment.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   └── validators/
│       └── index.js
├── docs/
│   └── swagger.yaml
├── tests/
│   └── auth.test.js
├── uploads/
├── .env.example
└── README.md
```

---

## ⚙️ Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-repo/blog-api.git
cd blog-api

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# → Modifier MONGO_URI et JWT_SECRET dans .env

# 4. Lancer le serveur (développement)
npm run dev
```

---

## 🔑 Variables d'environnement

| Variable         | Description                        | Défaut                                  |
|-----------------|------------------------------------|-----------------------------------------|
| `PORT`          | Port du serveur                    | `5000`                                  |
| `MONGO_URI`     | URI de connexion MongoDB           | `mongodb://localhost:27017/blog-api`    |
| `JWT_SECRET`    | Clé secrète JWT                    | *(obligatoire)*                         |
| `JWT_EXPIRES_IN`| Durée de validité du token         | `7d`                                    |
| `NODE_ENV`      | Environnement                      | `development`                           |
| `MAX_FILE_SIZE` | Taille max des fichiers (bytes)    | `5242880` (5MB)                         |

---

## 📡 Endpoints API

### Auth
| Méthode | Route                | Accès   | Description             |
|---------|---------------------|---------|-------------------------|
| POST    | `/api/auth/register`| Public  | Inscription             |
| POST    | `/api/auth/login`   | Public  | Connexion               |
| GET     | `/api/auth/me`      | Privé   | Voir son profil         |
| PUT     | `/api/auth/me`      | Privé   | Modifier son profil     |
| PUT     | `/api/auth/me/avatar`| Privé  | Changer son avatar      |

### Articles
| Méthode | Route                | Accès       | Description                      |
|---------|---------------------|-------------|----------------------------------|
| GET     | `/api/articles`      | Public      | Liste avec filtres + pagination  |
| POST    | `/api/articles`      | Auth requis | Créer un article                 |
| GET     | `/api/articles/:id`  | Public      | Détail (ID ou slug)              |
| PUT     | `/api/articles/:id`  | Auteur/Admin| Modifier un article              |
| DELETE  | `/api/articles/:id`  | Auteur/Admin| Supprimer un article             |

### Commentaires
| Méthode | Route                              | Accès       | Description             |
|---------|------------------------------------|-------------|-------------------------|
| GET     | `/api/articles/:articleId/comments`| Public      | Commentaires d'un article|
| POST    | `/api/articles/:articleId/comments`| Auth requis | Ajouter un commentaire  |
| PUT     | `/api/comments/:id`                | Auteur/Admin| Modifier un commentaire |
| DELETE  | `/api/comments/:id`                | Auteur/Admin| Supprimer un commentaire|

---

## 🔍 Filtres articles

```
GET /api/articles?page=1&limit=10&category=tech&search=nodejs&tags=js,api&sortBy=createdAt&order=desc
```

| Paramètre  | Type   | Description                                     |
|-----------|--------|-------------------------------------------------|
| `page`    | number | Numéro de page (défaut: 1)                      |
| `limit`   | number | Résultats par page (défaut: 10)                 |
| `category`| string | Filtrer par catégorie                           |
| `search`  | string | Recherche full-text (titre + contenu + tags)    |
| `tags`    | string | Tags séparés par virgule                        |
| `sortBy`  | string | Champ de tri (défaut: `createdAt`)              |
| `order`   | string | `asc` ou `desc` (défaut: `desc`)               |

---

## 🧪 Tests

```bash
npm test
```

---

## 📚 Documentation Swagger

Accéder à la documentation interactive :
```
http://localhost:5000/api/docs
```

---

## 🐳 Docker (optionnel)

```bash
# Build
docker build -t blog-api .

# Run avec MongoDB
docker-compose up
```

---

## 👤 Auteur

Projet académique - Mini-Projet API REST (Express + MongoDB)
```
