import mongoose from 'mongoose';

type HouseholdColorModelType = {
  colorCode: string | null;
  householdId: number;
};

const householdColorSchema = new mongoose.Schema<HouseholdColorModelType>({
  colorCode: String,
  householdId: Number,
});

export const HouseholdColorModel: mongoose.Model<HouseholdColorModelType> =
  mongoose.models.HouseholdColor ||
  mongoose.model<HouseholdColorModelType>(
    'HouseholdColor',
    householdColorSchema
  );
