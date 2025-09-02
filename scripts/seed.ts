import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Company } from '../src/models/Company.js';

async function run() {
  await connectDB();
  let employer = await User.findOne({ email: 'hr@acme.com' }).select('+password');
  if (!employer) {
    employer = await User.create({ name: 'Acme HR', email: 'hr@acme.com', password: 'secret123', role: 'employer' });
  }
  const exists = await Company.findOne({ owner: employer._id, name: 'Acme GmbH' });
  if (!exists) {
    await Company.create({ name: 'Acme GmbH', website: 'https://acme.example', location: 'Berlin', description: 'Tech company', owner: employer._id });
  }
  console.log('Seed completed.');
  await disconnectDB();
}
run().catch(e => { console.error(e); process.exit(1); });
