import mongoose from 'mongoose';

import { paramsSchema } from './client';
import { ZetkinLocation } from 'features/areaAssignments/types';

type Result = ZetkinLocation;

export const createHouseholdsDef = {
  handler: handle,
  name: 'createHouseholds',
  schema: paramsSchema,
};

async function handle(): Promise<Result> {
  await mongoose.connect(process.env.MONGODB_URL || '');

  throw new Error('Unknown location');
}
