import mongoose from 'mongoose';

type PetitionModelType = {
  petitionId: number;
  orgId: number;
  title: string | null;
  description: string | null;
};

const petitionSchema = new mongoose.Schema<PetitionModelType>({
  petitionId: Number,
  orgId: Number,
  title: String,
  description: String,
});

export const PetitionModel: mongoose.Model<PetitionModelType> =
  mongoose.models.Petition ||
  mongoose.model<PetitionModelType>('Petition', petitionSchema);
