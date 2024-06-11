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
