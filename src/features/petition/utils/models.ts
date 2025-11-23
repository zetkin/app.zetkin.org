import mongoose from 'mongoose';

type PetitionModelType = {
  id: number;
  orgId: number;
  campId: number;
  created_at: string;
  title: string;
  info_text: string | null;
  published: string | null;
  expires: string | null;
  content: string | null;
  signature_count: number | null;
  signature_goal: number | null;
};

const petitionSchema = new mongoose.Schema<PetitionModelType>({
  id: Number,
  orgId: Number,
  title: String,
  created_at: String,
  info_text: String,
  content: String,
});

export const PetitionModel: mongoose.Model<PetitionModelType> =
  mongoose.models.Petition ||
  mongoose.model<PetitionModelType>('Petition', petitionSchema);
