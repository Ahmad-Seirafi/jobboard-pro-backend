import mongoose, { Schema, Document } from 'mongoose';

export type ApplicationStatus = 'submitted' | 'reviewed' | 'accepted' | 'rejected';

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  notes?: string;
}

const ApplicationSchema = new Schema<IApplication>({
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl: String,
  coverLetter: String,
  status: { type: String, enum: ['submitted','reviewed','accepted','rejected'], default: 'submitted' },
  notes: String
}, { timestamps: true });

ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
