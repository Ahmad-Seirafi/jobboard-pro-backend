import { connectDB, disconnectDB } from '../src/config/db.js';
import { Job } from '../src/models/Job.js';

async function run() {
  await connectDB();
  await Job.syncIndexes();
  console.log('Job indexes synced');
  await disconnectDB();
}
run().catch(e => { console.error(e); process.exit(1); });
