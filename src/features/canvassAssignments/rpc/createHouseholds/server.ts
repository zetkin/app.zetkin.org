import mongoose from 'mongoose';
import { z } from 'zod';

import { paramsSchema } from './client';
import { ZetkinPlace } from 'features/canvassAssignments/types';
import { PlaceModel } from 'features/canvassAssignments/models';

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinPlace;

export const createHouseholdsDef = {
  handler: handle,
  name: 'createHouseholds',
  schema: paramsSchema,
};

async function handle(params: Params): Promise<Result> {
  await mongoose.connect(process.env.MONGODB_URL || '');

  const { households, orgId, placeId } = params;

  const model = await PlaceModel.findOneAndUpdate(
    { _id: placeId, orgId },
    {
      $push: {
        households: {
          $each: households.map((input) => ({
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
    throw new Error('Unknown place');
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
