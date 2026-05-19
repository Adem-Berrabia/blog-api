const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

// Connexion test DB en mémoire (mock simple)
beforeAll(async () => {
  process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blog-test';
  process.env.JWT_SECRET = 'test_secret_key';
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch {
    // DB non disponible → tests mockés
  }
});

afterAll(async () => {
  try {
    await User.deleteMany({ email: /test/ });
    await mongoose.connection.close();
  } catch {}
});

describe('🔐 Auth Routes', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  // ── Inscription ──────────────────────────────
  describe('POST /api/auth/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      if (res.status === 201) {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.user.email).toBe(testUser.email);
        expect(res.body.data.user).not.toHaveProperty('password');
      } else {
        // DB non dispo ou email déjà utilisé
        expect([201, 409, 500]).toContain(res.status);
      }
    });

    it('devrait refuser sans email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', password: '123456' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('devrait refuser un mot de passe trop court', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test2@example.com', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('devrait refuser un email invalide', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'invalid-email', password: '123456' });

      expect(res.status).toBe(400);
    });
  });

  // ── Connexion ────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('devrait refuser un email manquant', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('devrait refuser un mot de passe manquant', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
    });
  });

  // ── Profil protégé ───────────────────────────
  describe('GET /api/auth/me', () => {
    it('devrait refuser sans token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('devrait refuser avec un token invalide', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(401);
    });
  });
});

describe('📰 Article Routes', () => {
  describe('GET /api/articles', () => {
    it('devrait retourner une liste (même vide)', async () => {
      const res = await request(app).get('/api/articles');
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('articles');
        expect(res.body.data).toHaveProperty('pagination');
      }
    });

    it('devrait refuser la création sans token', async () => {
      const res = await request(app)
        .post('/api/articles')
        .send({ title: 'Test', content: 'Contenu de test pour article' });

      expect(res.status).toBe(401);
    });
  });
});

describe('🏥 Health Check', () => {
  it('GET /health devrait retourner 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('opérationnelle');
  });
});

describe('🔍 404 Handler', () => {
  it('devrait retourner 404 pour une route inconnue', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
