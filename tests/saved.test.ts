import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { registerAndLogin } from './helpers.js';

let app: any;
let mongod: MongoMemoryServer;
let companyId: string;
let jobId: string;

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

test('user can save and unsave jobs', async () => {
  const employerToken = await registerAndLogin(app, 'employer', 'hr5@example.com');
  const userToken = await registerAndLogin(app, 'user', 'user5@example.com');

  // company + job
  const company = await request(app).post('/api/companies')
    .set('Authorization', `Bearer ${employerToken}`)
    .send({ name: 'CompanyZ', location: 'Hamburg' });
  companyId = company.body.company._id;

  const job = await request(app).post('/api/jobs')
    .set('Authorization', `Bearer ${employerToken}`)
    .send({ title: 'TS Dev', description: 'Strong TS', location: 'Hamburg', type: 'full-time', companyId });
  jobId = job.body.job._id;

  // save
  const save = await request(app).post(`/api/saved/${jobId}`).set('Authorization', `Bearer ${userToken}`);
  expect(save.status).toBe(201);

  // list
  const list = await request(app).get('/api/saved/mine').set('Authorization', `Bearer ${userToken}`);
  expect(list.status).toBe(200);
  expect(list.body.items.length).toBe(1);

  // unsave
  const del = await request(app).delete(`/api/saved/${jobId}`).set('Authorization', `Bearer ${userToken}`);
  expect(del.status).toBe(204);
});
