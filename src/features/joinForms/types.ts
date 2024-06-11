export type ZetkinJoinForm = {
  description: string;
  embeddable: boolean;
  fields: string[];
  id: number;
  organization: {
    id: number;
    title: string;
  };
  renderable: boolean;
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
