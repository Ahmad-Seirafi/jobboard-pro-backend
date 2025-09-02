import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  website?: string;
  location?: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  website: String,
  location: String,
  description: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

CompanySchema.index({ owner: 1, name: 1 }, { unique: true });

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
