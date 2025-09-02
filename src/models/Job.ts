import mongoose, { Schema, Document } from 'mongoose';

export type JobStatus = 'draft' | 'open' | 'closed';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';

export interface IJob extends Document {
  title: string;
  description: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  type: JobType;
  tags: string[];
  status: JobStatus;
  remote?: boolean;
  benefits?: string[];
  closesAt?: Date;
  company: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salaryMin: Number,
  salaryMax: Number,
  type: { type: String, enum: ['full-time','part-time','contract','internship','remote'], default: 'full-time' },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['draft','open','closed'], default: 'open' },
  remote: { type: Boolean, default: false },
  benefits: { type: [String], default: [] },
  closesAt: { type: Date },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

JobSchema.index(
  { title: 'text', description: 'text', location: 'text' },
  { weights: { title: 5, description: 3, location: 1 }, name: 'jobs_text' }
);
JobSchema.index({ tags: 1 });
JobSchema.index({ status: 1, createdAt: -1 });
JobSchema.index({ company: 1, createdAt: -1 });

export const Job = mongoose.model<IJob>('Job', JobSchema);
