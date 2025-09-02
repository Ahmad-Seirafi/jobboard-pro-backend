import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedJob extends Document {
  user: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
}

const SavedJobSchema = new Schema<ISavedJob>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true }
}, { timestamps: true });

SavedJobSchema.index({ user: 1, job: 1 }, { unique: true });

export const SavedJob = mongoose.model<ISavedJob>('SavedJob', SavedJobSchema);
