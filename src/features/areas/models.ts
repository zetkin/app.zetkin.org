import mongoose from 'mongoose';

import { ZetkinArea } from './types';

type ZetkinAreaModelType = {
  boundary: ZetkinArea['boundary'];
  description: string;
  orgId: number;
  tags: { id: number; value?: string }[];
  title: string;
};

const areaSchema = new mongoose.Schema<ZetkinAreaModelType>({
  boundary: Object,
  description: String,
  orgId: { required: true, type: Number },
  tags: Array,
  title: String,
});

export const AreaModel: mongoose.Model<ZetkinAreaModelType> =
  mongoose.models.Area ||
  mongoose.model<ZetkinAreaModelType>('Area', areaSchema);
