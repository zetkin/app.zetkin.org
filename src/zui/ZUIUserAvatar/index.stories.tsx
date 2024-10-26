import { Meta, StoryFn } from '@storybook/react';

import ZUIUserAvatar from '.';

export default {
  component: ZUIUserAvatar,
  title: 'Old/ZUIUserAvatar',
} as Meta<typeof ZUIUserAvatar>;

const Template: StoryFn<typeof ZUIUserAvatar> = (args) => {
  return <ZUIUserAvatar personId={args.personId} />;
};

export const basic = Template.bind({});
basic.args = {
  personId: 1,
};
