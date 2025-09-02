import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { registerAndLogin } from './helpers.js';

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

test('employer can create company, user cannot', async () => {
  const employerToken = await registerAndLogin(app, 'employer', 'hr2@example.com');
  const create = await request(app).post('/api/companies')
    .set('Authorization', `Bearer ${employerToken}`)
    .send({ name: 'Acme GmbH', website: 'https://acme.example', location: 'Berlin' });
  expect(create.status).toBe(201);

  const userToken = await registerAndLogin(app, 'user', 'user2@example.com');
  const fail = await request(app).post('/api/companies')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ name: 'Nope Inc' });
  expect(fail.status).toBe(403);
});
