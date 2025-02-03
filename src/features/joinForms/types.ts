import {
  CUSTOM_FIELD_TYPE,
  ZetkinPerson,
  ZetkinPersonNativeFields,
} from 'utils/types/zetkin';

export type ZetkinJoinForm = {
  description: string;
  embeddable: boolean;
  fields: string[];
  id: number;
  org_access: 'sameorg' | 'suborgs';
  organization: {
    id: number;
    title: string;
  };
  renderable: boolean;
  requires_email_verification: boolean;
  submit_token: string;
  tags: {
    id: number;
    title: string;
  }[];
  title: string;
};

export type ZetkinJoinFormPatchBody = Partial<
  Omit<ZetkinJoinForm, 'id' | 'organization' | 'submit_token'>
>;

export type ZetkinJoinFormPostBody =
  // Most fields are optional
  Partial<Omit<ZetkinJoinForm, 'id' | 'organization' | 'submit_token'>> &
    // Require title and fields
    Pick<ZetkinJoinForm, 'title' | 'fields'>;

export type ZetkinJoinSubmission = {
  accepted: string | null;
  form: {
    id: number;
    title: string;
  };
  id: number;
  person_data: ZetkinPerson;
  state: 'pending' | 'accepted';
  submitted: string;
};

export type ZetkinJoinSubmissionPatchBody = Pick<ZetkinJoinSubmission, 'state'>;

type EmbeddedJoinFormDataField =
  | {
      s: keyof ZetkinPersonNativeFields;
    }
  | { l: string; s: string; t: CUSTOM_FIELD_TYPE };

export type EmbeddedJoinFormData = {
  fields: EmbeddedJoinFormDataField[];
  formId: number;
  orgId: number;
  token: string;
};

export type EmbeddedJoinFormStatus = 'editing' | 'submitted';
