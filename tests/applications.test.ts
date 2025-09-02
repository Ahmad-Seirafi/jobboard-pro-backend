import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'node:path';
import fs from 'node:fs';
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

test('user can apply and employer can list applications', async () => {
  const employerToken = await registerAndLogin(app, 'employer', 'hr4@example.com');
  const userToken = await registerAndLogin(app, 'user', 'user4@example.com');

  // company + job
  const company = await request(app).post('/api/companies')
    .set('Authorization', `Bearer ${employerToken}`)
    .send({ name: 'CompanyY', location: 'Munich' });
  companyId = company.body.company._id;

  const job = await request(app).post('/api/jobs')
    .set('Authorization', `Bearer ${employerToken}`)
    .send({ title: 'Backend Eng', description: 'Node+Mongo', location: 'Munich', type: 'full-time', companyId });
  jobId = job.body.job._id;

  // dummy resume file
  const resumePath = path.join(process.cwd(), 'tests', 'dummy.txt');
  fs.writeFileSync(resumePath, 'resume');

  const apply = await request(app).post(`/api/applications/${jobId}/apply`)
    .set('Authorization', `Bearer ${userToken}`)
    .attach('resume', resumePath)
    .field('coverLetter', 'Hello');
  expect(apply.status).toBe(201);

  const list = await request(app).get(`/api/applications/job/${jobId}`)
    .set('Authorization', `Bearer ${employerToken}`);
  expect(list.status).toBe(200);
  expect(list.body.items.length).toBe(1);
});
