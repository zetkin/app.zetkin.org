import { EmailFrame } from 'features/emails/types';

export type LibraryImageConfig = {
  attributes: EmailFrame['blockAttributes']['image'];
  orgId: number;
};

export type LibraryImageData = {
  fileId: number;
  fileName: string;
  url: string;
};
