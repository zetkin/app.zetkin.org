import mongoose from 'mongoose';

import { ZetkinArea } from './types';

type IZetkinModel = ZetkinArea & {
  orgId: number;
};

const areaSchema = new mongoose.Schema<IZetkinModel>({
  id: Number,
  orgId: Number,
  points: Array,
});

export const AreaModel =
  mongoose.models.Area || mongoose.model<IZetkinModel>('Area', areaSchema);
