import mongoose from 'mongoose';

import { ZetkinArea } from './types';

type IZetkinModel = {
  orgId: number;
  points: ZetkinArea['points'];
};

const areaSchema = new mongoose.Schema<IZetkinModel>({
  orgId: { required: true, type: Number },
  points: Array,
});

export const AreaModel: mongoose.Model<IZetkinModel> =
  mongoose.models.Area || mongoose.model<IZetkinModel>('Area', areaSchema);
