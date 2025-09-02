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

test('employer creates job and list/search works', async () => {
  const employerToken = await registerAndLogin(app, 'employer', 'hr3@example.com');

  // create company
  const company = await request(app).post('/api/companies')
    .set('Authorization', `Bearer ${employerToken}`)
    .send({ name: 'CompanyX', location: 'Berlin' });
  companyId = company.body.company._id;

  // create job
  const job = await request(app).post('/api/jobs')
    .set('Authorization', `Bearer ${employerToken}`)
    .send({ title: 'Node Dev', description: 'Express TS', location: 'Berlin', type: 'full-time', tags: ['node','ts'], companyId });
  expect(job.status).toBe(201);
  jobId = job.body.job._id;

  const list = await request(app).get('/api/jobs?q=Node&location=Berlin');
  expect(list.status).toBe(200);
  expect(list.body.total).toBe(1);
});
