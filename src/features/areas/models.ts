import mongoose from 'mongoose';

import {
  Household,
  ZetkinArea,
  ZetkinCanvassAssignee,
  ZetkinPlace,
} from './types';

type ZetkinAreaModelType = {
  description: string | null;
  orgId: number;
  points: ZetkinArea['points'];
  title: string | null;
};

type ZetkinPlaceModelType = {
  description: string | null;
  households: Household[];
  orgId: number;
  position: ZetkinPlace['position'];
  title: string | null;
  type: 'address' | 'misc';
};

type ZetkinCanvassAssignmentModelType = {
  campId: number;
  id: number;
  orgId: number;
  sessions: {
    areaId: string;
    personId: number;
  }[];
  title: string | null;
};

type ZetkinCanvassAssigneeModelType = ZetkinCanvassAssignee;

const areaSchema = new mongoose.Schema<ZetkinAreaModelType>({
  description: String,
  orgId: { required: true, type: Number },
  points: Array,
  title: String,
});

const placeSchema = new mongoose.Schema<ZetkinPlaceModelType>({
  description: String,
  households: [
    {
      _id: false,
      id: String,
      title: String,
      visits: [{ _id: false, id: String, note: String, timestamp: String }],
    },
  ],
  orgId: { required: true, type: Number },
  position: Object,
  title: String,
  type: String,
});

const canvassAssignmentSchema =
  new mongoose.Schema<ZetkinCanvassAssignmentModelType>({
    campId: Number,
    orgId: { required: true, type: Number },
    sessions: [
      {
        areaId: String,
        personId: Number,
      },
    ],
    title: String,
  });

const canvassAssigneeSchema =
  new mongoose.Schema<ZetkinCanvassAssigneeModelType>({
    canvassAssId: String,
    id: { required: true, type: Number },
  });

export const AreaModel: mongoose.Model<ZetkinAreaModelType> =
  mongoose.models.Area ||
  mongoose.model<ZetkinAreaModelType>('Area', areaSchema);

export const PlaceModel: mongoose.Model<ZetkinPlaceModelType> =
  mongoose.models.Place ||
  mongoose.model<ZetkinPlaceModelType>('Place', placeSchema);

export const CanvassAssignmentModel: mongoose.Model<ZetkinCanvassAssignmentModelType> =
  mongoose.models.CanvassAssignment ||
  mongoose.model<ZetkinCanvassAssignmentModelType>(
    'CanvassAssignment',
    canvassAssignmentSchema
  );

export const CanvassAssigneeModel: mongoose.Model<ZetkinCanvassAssigneeModelType> =
  mongoose.models.CanvassAssignee ||
  mongoose.model<ZetkinCanvassAssigneeModelType>(
    'CanvassAssignee',
    canvassAssigneeSchema
  );
