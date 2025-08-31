import mongoose from 'mongoose';

type ZetkinDoorAssignmentModelType = {
  campId: number;
  id: number;
  orgId: number;
  sessions: {
    areaId: string;
    personId: number;
  }[];
  title: string | null;
};

const doorAssignmentSchema = new mongoose.Schema<ZetkinDoorAssignmentModelType>(
  {
    campId: Number,
    orgId: { required: true, type: Number },
    title: String,
  }
);

export const DoorAssigmentModel: mongoose.Model<ZetkinDoorAssignmentModelType> =
  mongoose.models.DoorAssignment ||
  mongoose.model<ZetkinDoorAssignmentModelType>(
    'DoorAssignment',
    doorAssignmentSchema
  );
