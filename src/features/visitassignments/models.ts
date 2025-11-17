import mongoose from 'mongoose';

import { ZetkinQuery } from 'features/smartSearch/components/types';
import { ZetkinAppliedTag } from 'utils/types/zetkin';

// --- Model types ---

type ZetkinVisitAssigneeModelType = {
  excluded_tags: ZetkinAppliedTag[];
  first_name: string;
  id: number;
  last_name: string;
  prioritized_tags: ZetkinAppliedTag[];
  visitAssId: number;
};

type ZetkinMetricModelType = {
  created: string;
  defines_success: boolean;
  description: string;
  id: number;
  question: string;
  type: 'bool' | 'scale5';
  visit_assignment_id: number;
};

type ZetkinVisitAssignmentModelType = {
  assignees: ZetkinVisitAssigneeModelType[];
  campId: number;
  end_date: string | null;
  id: number;
  orgId: number;
  queryId: number;
  start_date: string | null;
  target: ZetkinQuery | null;
  title: string | null;
};

// --- Counters ---

const visitAssignmentCounterSchema = new mongoose.Schema({
  _id: { required: true, type: String },
  seq: { default: 0, type: Number },
});

const VisitAssignmentCounter =
  mongoose.models.VisitAssignmentCounter ||
  mongoose.model('VisitAssignmentCounter', visitAssignmentCounterSchema);

const getNextVisitAssignmentId = async () => {
  const counter = await VisitAssignmentCounter.findOneAndUpdate(
    { _id: 'visitAssId' },
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
    { _id: 'visitAssId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

// --- Schemas ---

const visitAssigneeSchema = new mongoose.Schema<ZetkinVisitAssigneeModelType>({
  excluded_tags: [{ type: mongoose.Schema.Types.Mixed }],
  first_name: { required: true, type: String },
  id: { required: true, type: Number },
  last_name: { required: true, type: String },
  prioritized_tags: [{ type: mongoose.Schema.Types.Mixed }],
  visitAssId: { required: true, type: Number },
});

const zetkinMetricSchema = new mongoose.Schema<ZetkinMetricModelType>({
  created: { required: true, type: String },
  defines_success: { required: true, type: Boolean },
  description: { type: String },
  id: { required: true, type: Number, unique: true },
  question: { type: String },
  type: { enum: ['bool', 'scale5'], required: true, type: String },
  visit_assignment_id: { required: true, type: Number },
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

const visitAssignmentSchema =
  new mongoose.Schema<ZetkinVisitAssignmentModelType>({
    assignees: [visitAssigneeSchema],
    campId: { required: true, type: Number },
    end_date: { type: Date },
    id: { required: true, type: Number, unique: true },
    orgId: { required: true, type: Number },
    queryId: { required: true, type: Number },
    start_date: { type: Date },
    target: { required: false, type: mongoose.Schema.Types.Mixed },
    title: String,
  });

visitAssignmentSchema.pre<ZetkinVisitAssignmentModelType>(
  'validate',
  async function (next) {
    if (!this.id) {
      this.id = await getNextVisitAssignmentId();
    }
    next();
  }
);

// --- Mongoose models ---

export const ZetkinMetricModel: mongoose.Model<ZetkinMetricModelType> =
  mongoose.models.ZetkinMetric ||
  mongoose.model<ZetkinMetricModelType>('ZetkinMetric', zetkinMetricSchema);

export const ZetkinVisitAssigneeModel: mongoose.Model<ZetkinVisitAssigneeModelType> =
  mongoose.models.ZetkinVisitAssignee ||
  mongoose.model<ZetkinVisitAssigneeModelType>(
    'ZetkinVisitAssignee',
    visitAssigneeSchema
  );

export const VisitAssignmentModel: mongoose.Model<ZetkinVisitAssignmentModelType> =
  mongoose.models.VisitAssignment ||
  mongoose.model<ZetkinVisitAssignmentModelType>(
    'VisitAssignment',
    visitAssignmentSchema
  );
