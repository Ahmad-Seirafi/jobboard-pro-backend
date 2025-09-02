import request from 'supertest';

export async function registerAndLogin(app: any, role: 'user'|'employer'='user', email?: string) {
  const em = email || (role==='user' ? 'user@example.com' : 'hr@example.com');
  const name = role==='user' ? 'User' : 'HR';
  await request(app).post('/api/auth/register').send({ name, email: em, password: 'secret123', role });
  const res = await request(app).post('/api/auth/login').send({ email: em, password: 'secret123' });
  return res.body.tokens.access as string;
}
