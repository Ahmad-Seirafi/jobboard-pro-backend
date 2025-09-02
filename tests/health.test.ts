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

test('GET /health should return ok', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('ok');
});
