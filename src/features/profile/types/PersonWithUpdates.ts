import { ZetkinPersonNativeFields } from 'utils/types/zetkin';

export interface PersonWithUpdates extends ZetkinPersonNativeFields {
  _history?: {
    created: string;
    fields: Record<keyof ZetkinPersonNativeFields, string | null>;
    last_update: string;
  };
}
