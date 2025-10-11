import mongoose from 'mongoose';

type ZetkinHouseholdsAssignmentModelType = {
  campId: number;
  orgId: number;
  title: string | null;
};

const householdsAssignmentSchema =
  new mongoose.Schema<ZetkinHouseholdsAssignmentModelType>({
    campId: { required: true, type: Number },
    orgId: { required: true, type: Number },
    title: String,
  });

export const HouseholdsAssignmentModel: mongoose.Model<ZetkinHouseholdsAssignmentModelType> =
  mongoose.models.CanvassAssignment ||
  mongoose.model<ZetkinHouseholdsAssignmentModelType>(
    'HouseholdsAssignment',
    householdsAssignmentSchema
  );
