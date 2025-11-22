import mongoose from 'mongoose';

import { ZetkinPersonNativeFields } from 'utils/types/zetkin';

type PersonModelType = {
  _history?: {
    created: string;
    fields: Record<keyof ZetkinPersonNativeFields, string | null>;
    last_update: string;
  }
  personId: number;
};

const personSchema = new mongoose.Schema<PersonModelType>({
  _history: {
    created: String,
    fields: Object,
    last_update: String,
  },
  personId: Number,
});

export const PersonModel: mongoose.Model<PersonModelType> =
  mongoose.models.Person ||
  mongoose.model<PersonModelType>(
    'Person',
    personSchema
  );
