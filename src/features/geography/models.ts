import mongoose from 'mongoose';

import { ZetkinArea } from './types';

type ZetkinAreaModelType = {
  description: string | null;
  orgId: number;
  points: ZetkinArea['points'];
  tags: { id: number; value?: string }[];
  title: string | null;
};

const areaSchema = new mongoose.Schema<ZetkinAreaModelType>({
  description: String,
  orgId: { required: true, type: Number },
  points: Array,
  tags: Array,
  title: String,
});

export const AreaModel: mongoose.Model<ZetkinAreaModelType> =
  mongoose.models.Area ||
  mongoose.model<ZetkinAreaModelType>('Area', areaSchema);
