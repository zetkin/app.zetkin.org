import mongoose from 'mongoose';

type EventSignupModelType = {
  email?: string;
  eventId: number;
  first_name: string;
  last_name: string;
  orgId: number;
  phone?: string;
};

const eventSignupSchema = new mongoose.Schema<EventSignupModelType>({
  email: String,
  eventId: { required: true, type: Number },
  first_name: { required: true, type: String },
  last_name: { required: true, type: String },
  orgId: { required: true, type: Number },
  phone: String,
});

export const EventSignupModel: mongoose.Model<EventSignupModelType> =
  mongoose.models.EventSignup ||
  mongoose.model<EventSignupModelType>('EventSignup', eventSignupSchema);


