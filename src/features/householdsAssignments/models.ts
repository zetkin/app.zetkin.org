import mongoose from 'mongoose';

type ZetkinHouseholdsAssigneeModelType = {
  householdsAssId: number;
  user_id: number;
};

type ZetkinHouseholdsAssignmentModelType = {
  assignees: ZetkinHouseholdsAssigneeModelType[]; // people goign to the households, look for UserAutocomplete in the AreaSelect.ts file
  campId: number;
  end_date: string | null;
  id: number;
  orgId: number;
  queryId: number; // in the post handler, it needs to already add a smartSearch Query object post to /orgs/[orgId]/people/queries and use the id returned by the /api
  start_date: string | null;
  title: string | null;
};

const householdsAssigneeSchema =
  new mongoose.Schema<ZetkinHouseholdsAssigneeModelType>({
    householdsAssId: { required: true, type: Number },
    user_id: { required: true, type: Number },
  });

const counterSchema = new mongoose.Schema({
  _id: { required: true, type: String },
  seq: { default: 0, type: Number },
});
const Counter =
  mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const getNextHouseholdAssignmentId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'householdAssignmentId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

const householdsAssignmentSchema =
  new mongoose.Schema<ZetkinHouseholdsAssignmentModelType>({
    assignees: [householdsAssigneeSchema],
    campId: { required: true, type: Number },
    id: { required: true, type: Number, unique: true },
    orgId: { required: true, type: Number },
    queryId: { required: true, type: Number },
    title: String,
  });

householdsAssignmentSchema.pre<ZetkinHouseholdsAssignmentModelType>(
  'validate',
  async function (next) {
    if (!this.id) {
      this.id = await getNextHouseholdAssignmentId();
    }
    next();
  }
);

export const HouseholdsAssignmentModel: mongoose.Model<ZetkinHouseholdsAssignmentModelType> =
  mongoose.models.HouseholdsAssignment ||
  mongoose.model<ZetkinHouseholdsAssignmentModelType>(
    'HouseholdsAssignment',
    householdsAssignmentSchema
  );
