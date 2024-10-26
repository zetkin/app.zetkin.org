import { Meta, StoryFn } from '@storybook/react';

import ZUIPersonAvatar from '.';

export default {
  component: ZUIPersonAvatar,
  title: 'Old/ZUIPersonAvatar',
} as Meta<typeof ZUIPersonAvatar>;

const Template: StoryFn<typeof ZUIPersonAvatar> = (args) => {
  return <ZUIPersonAvatar orgId={args.orgId} personId={args.personId} />;
};

export const basic = Template.bind({});
basic.args = {
  orgId: 1,
  personId: 1,
};
