import mongoose from 'mongoose';
import { z } from 'zod';

import { paramsSchema } from './client';
import { ZetkinLocation } from 'features/areaAssignments/types';
import { LocationModel } from 'features/areaAssignments/models';

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinLocation;

export const createHouseholdsDef = {
  handler: handle,
  name: 'createHouseholds',
  schema: paramsSchema,
};

async function handle(params: Params): Promise<Result> {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const { households, orgId, locationId } = params;

  const model = await LocationModel.findOneAndUpdate(
    { _id: locationId, orgId },
    {
      $push: {
        households: {
          $each: households.map((input) => ({
            floor: input.floor || null,
            id: new mongoose.Types.ObjectId().toString(),
            ratings: [],
            title: input.title,
            visits: [],
          })),
          $position: 0,
        },
      },
    },
    { new: true }
  );

  if (!model) {
    throw new Error('Unknown location');
  }

  return {
    description: model.description,
    households: model.households,
    id: model._id.toString(),
    orgId: orgId,
    position: model.position,
    title: model.title,
  };
}
