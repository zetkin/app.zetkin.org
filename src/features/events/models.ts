import mongoose from 'mongoose';

export type EventSignupModelType = {
  created: string;
  email?: string;
  eventId: number;
  first_name: string;
  gdpr_consent: boolean;
  id: string;
  last_name: string;
  orgId: number;
  person_id?: number;
  phone?: string;
};

const eventSignupSchema = new mongoose.Schema<EventSignupModelType>({
  created: { default: () => new Date().toISOString(), type: String },
  email: String,
  eventId: { required: true, type: Number },
  first_name: { required: true, type: String },
  gdpr_consent: { required: true, type: Boolean },
  last_name: { required: true, type: String },
  orgId: { required: true, type: Number },
  phone: String,
});

export const EventSignupModel: mongoose.Model<EventSignupModelType> =
  mongoose.models.EventSignup ||
  mongoose.model<EventSignupModelType>('EventSignup', eventSignupSchema);
