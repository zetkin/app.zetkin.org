import mongoose from 'mongoose';

import { ZetkinMetric, ZetkinLocation } from './types';

type ZetkinAreaAssignmentModelType = {
  campId: number;
  end_date: string | null;
  id: number;
  instructions: string;
  metrics: (Omit<ZetkinMetric, 'id'> & { _id: string })[];
  orgId: number;
  reporting_level: 'household' | 'location' | null;
  sessions: {
    areaId: string;
    personId: number;
  }[];
  start_date: string | null;
  title: string | null;
};

type ZetkinLocationModelType = Omit<ZetkinLocation, '_id'>;

const areaAssignmentSchema = new mongoose.Schema<ZetkinAreaAssignmentModelType>(
  {
    campId: Number,
    end_date: {
      default: null,
      type: String,
    },
    instructions: String,
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
  }
);

const locationSchema = new mongoose.Schema<ZetkinLocationModelType>({
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
          areaAssId: String,
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

export type LocationVisitModelType = {
  areaAssId: string;
  locationId: string;
  personId: number;
  responses: {
    metricId: string;
    responseCounts: number[];
  }[];
  timestamp: string;
};

const locationVisitSchema = new mongoose.Schema<LocationVisitModelType>({
  areaAssId: String,
  locationId: String,
  personId: Number,
  responses: [
    {
      metricId: String,
      responseCounts: [Number],
    },
  ],
  timestamp: String,
});

export const AreaAssignmentModel: mongoose.Model<ZetkinAreaAssignmentModelType> =
  mongoose.models.AreaAssignment ||
  mongoose.model<ZetkinAreaAssignmentModelType>(
    'AreaAssignment',
    areaAssignmentSchema
  );

export const LocationModel: mongoose.Model<ZetkinLocationModelType> =
  mongoose.models.Location ||
  mongoose.model<ZetkinLocationModelType>('Location', locationSchema);

export const LocationVisitModel: mongoose.Model<LocationVisitModelType> =
  mongoose.models.LocationVisit ||
  mongoose.model<LocationVisitModelType>('LocationVisit', locationVisitSchema);
