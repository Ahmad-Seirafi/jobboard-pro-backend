import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

let app: any;
let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  const mod = await import('../src/app.js');
  const db = await import('../src/config/db.js');
  await db.connectDB(process.env.MONGO_URI as string);
  app = mod.default;
});

afterAll(async () => {
  const db = await import('../src/config/db.js');
  await db.disconnectDB();
  await mongod.stop();
});

test('register + login + me + refresh', async () => {
  const email = 'user1@example.com';
  const reg = await request(app).post('/api/auth/register').send({ name: 'User1', email, password: 'secret123', role: 'user' });
  expect(reg.status).toBe(201);
  const login = await request(app).post('/api/auth/login').send({ email, password: 'secret123' });
  expect(login.status).toBe(200);
  const access = login.body.tokens.access;
  const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${access}`);
  expect(me.status).toBe(200);
  const refreshRes = await request(app).post('/api/auth/refresh').send({ refreshToken: login.body.tokens.refresh });
  expect(refreshRes.status).toBe(200);
  expect(refreshRes.body.tokens.access).toBeTruthy();
});
