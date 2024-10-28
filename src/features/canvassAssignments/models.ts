import mongoose from 'mongoose';

import { ZetkinMetric, ZetkinPlace } from './types';

type ZetkinCanvassAssignmentModelType = {
  campId: number;
  id: number;
  metrics: (Omit<ZetkinMetric, 'id'> & { _id: string })[];
  orgId: number;
  sessions: {
    areaId: string;
    personId: number;
  }[];
  title: string | null;
};

type ZetkinPlaceModelType = Omit<ZetkinPlace, '_id'>;

const canvassAssignmentSchema =
  new mongoose.Schema<ZetkinCanvassAssignmentModelType>({
    campId: Number,
    metrics: [
      {
        definesDone: Boolean,
        description: String,
        id: String,
        kind: String,
        question: String,
      },
    ],
    orgId: { required: true, type: Number },
    sessions: [
      {
        areaId: String,
        personId: Number,
      },
    ],
    title: String,
  });

const placeSchema = new mongoose.Schema<ZetkinPlaceModelType>({
  description: String,
  households: [
    {
      _id: false,
      id: String,
      title: String,
      visits: [
        {
          _id: false,
          canvassAssId: String,
          id: String,
          noteToOfficial: String,
          responses: [
            {
              metricId: String,
              response: String,
            },
          ],
          timestamp: String,
        },
      ],
    },
  ],
  orgId: { required: true, type: Number },
  position: Object,
  title: String,
});

export const CanvassAssignmentModel: mongoose.Model<ZetkinCanvassAssignmentModelType> =
  mongoose.models.CanvassAssignment ||
  mongoose.model<ZetkinCanvassAssignmentModelType>(
    'CanvassAssignment',
    canvassAssignmentSchema
  );
export const PlaceModel: mongoose.Model<ZetkinPlaceModelType> =
  mongoose.models.Place ||
  mongoose.model<ZetkinPlaceModelType>('Place', placeSchema);
