import mongoose from 'mongoose';

import { DialingMode } from './betaTypes';

type DialingModeModelType = {
  callAssId: number;
  mode: DialingMode;
};

const dialingModeSchema = new mongoose.Schema<DialingModeModelType>({
  callAssId: Number,
  mode: String,
});

export const DialingModeModel: mongoose.Model<DialingModeModelType> =
  mongoose.models.DialingMode ||
  mongoose.model<DialingModeModelType>('DialingMode', dialingModeSchema);
