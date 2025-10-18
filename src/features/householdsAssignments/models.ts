import mongoose from 'mongoose';

type ZetkinHouseholdsAssignmentModelType = {
  assigneeIds: number[]; // people goign to the households, look for UserAutocomplete in the AreaSelect.ts file
  campId: number;
  orgId: number;
  queryId: number; // in the post handler, it needs to already add a smartSearch Query object post to /orgs/[orgId]/people/queries and use the id returned by the /api
  title: string | null;
};

const householdsAssignmentSchema =
  new mongoose.Schema<ZetkinHouseholdsAssignmentModelType>({
    assigneeIds: [Number],
    campId: { required: true, type: Number },
    orgId: { required: true, type: Number },
    queryId: { required: true, type: Number },
    title: String,
  });

export const HouseholdsAssignmentModel: mongoose.Model<ZetkinHouseholdsAssignmentModelType> =
  mongoose.models.HouseholdsAssignment ||
  mongoose.model<ZetkinHouseholdsAssignmentModelType>(
    'HouseholdsAssignment',
    householdsAssignmentSchema
  );
