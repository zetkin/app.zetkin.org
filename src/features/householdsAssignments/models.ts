import mongoose from 'mongoose';

import { ZetkinQuery } from 'features/smartSearch/components/types';
import { ZetkinAppliedTag } from 'utils/types/zetkin';

type ZetkinHouseholdsAssigneeModelType = {
  excluded_tags: ZetkinAppliedTag[];
  first_name: string;
  householdsAssId: number;
  id: number;
  last_name: string;
  prioritized_tags: ZetkinAppliedTag[];
};

type ZetkinHouseholdsAssignmentModelType = {
  assignees: ZetkinHouseholdsAssigneeModelType[];
  campId: number;
  end_date: string | null;
  id: number;
  orgId: number;
  queryId: number;
  start_date: string | null;
  target: ZetkinQuery | null;
  title: string | null;
};

type ZetkinMetricModelType = {
  created: string;
  defines_success: boolean;
  description: string;
  household_assignment_id: number;
  id: number;
  question: string;
  type: 'bool' | 'scale5';
};

const householdsAssigneeSchema =
  new mongoose.Schema<ZetkinHouseholdsAssigneeModelType>({
    excluded_tags: [{ type: mongoose.Schema.Types.Mixed }],
    first_name: { required: true, type: String },
    householdsAssId: { required: true, type: Number },
    id: { required: true, type: Number },
    last_name: { required: true, type: String },
    prioritized_tags: [{ type: mongoose.Schema.Types.Mixed }],
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

const metricCounterSchema = new mongoose.Schema({
  _id: { required: true, type: String },
  seq: { default: 0, type: Number },
});

const MetricCounter =
  mongoose.models.MetricCounter ||
  mongoose.model('MetricCounter', metricCounterSchema);

const getNextMetricId = async () => {
  const counter = await MetricCounter.findOneAndUpdate(
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
    end_date: { type: Date },
    id: { required: true, type: Number, unique: true },
    orgId: { required: true, type: Number },
    queryId: { required: true, type: Number },
    start_date: { type: Date },
    target: { required: false, type: mongoose.Schema.Types.Mixed },
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

const zetkinMetricSchema = new mongoose.Schema<ZetkinMetricModelType>({
  created: { required: true, type: String },
  defines_success: { required: true, type: Boolean },
  description: { type: String },
  household_assignment_id: { required: true, type: Number },
  id: { required: true, type: Number, unique: true },
  question: { type: String },
  type: { enum: ['bool', 'scale5'], required: true, type: String },
});

zetkinMetricSchema.pre<ZetkinMetricModelType>(
  'validate',
  async function (next) {
    if (!this.id) {
      this.id = await getNextMetricId();
    }
    next();
  }
);

export const ZetkinMetricModel: mongoose.Model<ZetkinMetricModelType> =
  mongoose.models.ZetkinMetric ||
  mongoose.model<ZetkinMetricModelType>('ZetkinMetric', zetkinMetricSchema);
