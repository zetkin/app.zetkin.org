import mongoose from 'mongoose';

import { ZetkinMetric, ZetkinPlace } from './types';

type ZetkinCanvassAssignmentModelType = {
  campId: number;
  end_date: string | null;
  id: number;
  metrics: (Omit<ZetkinMetric, 'id'> & { _id: string })[];
  orgId: number;
  reporting_level: 'household' | 'place' | null;
  sessions: {
    areaId: string;
    personId: number;
  }[];
  start_date: string | null;
  title: string | null;
};

type ZetkinPlaceModelType = Omit<ZetkinPlace, '_id'>;

const canvassAssignmentSchema =
  new mongoose.Schema<ZetkinCanvassAssignmentModelType>({
    campId: Number,
    end_date: {
      default: null,
      type: String,
    },
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
    reporting_level: { required: true, type: String },
    sessions: [
      {
        areaId: String,
        personId: Number,
      },
    ],
    start_date: {
      default: null,
      type: String,
    },
    title: String,
  });

const placeSchema = new mongoose.Schema<ZetkinPlaceModelType>({
  description: String,
  households: [
    {
      _id: false,
      floor: Number,
      id: String,
      title: String,
      visits: [
        {
          _id: false,
          canvassAssId: String,
          id: String,
          noteToOfficial: String,
          personId: Number,
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

export type PlaceVisitModelType = {
  canvassAssId: string;
  personId: number;
  placeId: string;
  responses: {
    metricId: string;
    responseCounts: number[];
  }[];
  timestamp: string;
};

const placeVisitSchema = new mongoose.Schema<PlaceVisitModelType>({
  canvassAssId: String,
  personId: Number,
  placeId: String,
  responses: [
    {
      metricId: String,
      responseCounts: [Number],
    },
  ],
  timestamp: String,
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

export const PlaceVisitModel: mongoose.Model<PlaceVisitModelType> =
  mongoose.models.PlaceVisit ||
  mongoose.model<PlaceVisitModelType>('PlaceVisit', placeVisitSchema);
