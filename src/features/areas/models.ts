import mongoose from 'mongoose';

import { ZetkinArea } from './types';

type IZetkinModel = {
  description: string | null;
  numberOfActions: number;
  orgId: number;
  points: ZetkinArea['points'];
  title: string | null;
};

const areaSchema = new mongoose.Schema<IZetkinModel>({
  description: String,
  numberOfActions: Number,
  orgId: { required: true, type: Number },
  points: Array,
  title: String,
});

export const AreaModel: mongoose.Model<IZetkinModel> =
  mongoose.models.Area || mongoose.model<IZetkinModel>('Area', areaSchema);
