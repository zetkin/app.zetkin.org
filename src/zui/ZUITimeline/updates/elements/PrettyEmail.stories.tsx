import { Meta, StoryFn } from '@storybook/react';
import {
  MULTIPART,
  MULTIPART_WITH_REPLY,
  PLAINTEXT,
  PLAINTEXT_MULTI_CC,
} from 'utils/testing/mocks/email';

import PrettyEmail from './PrettyEmail';

export default {
  component: PrettyEmail,
  title: 'Organisms/Timeline/Updates/PrettyEmail',
} as Meta<typeof PrettyEmail>;

const Template: StoryFn<typeof PrettyEmail> = (args) => (
  <PrettyEmail emailStr={args.emailStr} />
);

export const plaintext = Template.bind({});
plaintext.args = {
  emailStr: PLAINTEXT,
};

export const plaintextMultiCc = Template.bind({});
plaintextMultiCc.args = {
  emailStr: PLAINTEXT_MULTI_CC,
};

export const html = Template.bind({});
html.args = {
  emailStr: MULTIPART,
};

export const htmlReply = Template.bind({});
htmlReply.args = {
  emailStr: MULTIPART_WITH_REPLY,
};
