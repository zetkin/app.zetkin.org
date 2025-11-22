// types/zetkinPetition.ts

export interface ZetkinPetitionPostBody {
  title: string;
  description: string;
  signature: 'require_signature' | 'optional_signature';
}

export interface ZetkinPetition {
  id: number;
  title: string;
  description: string;
  signature: 'require_signature' | 'optional_signature';
  orgId: number;
  project?: {
    id: number;
    title: string;
  };
  created_at: string;
  updated_at: string;
}
