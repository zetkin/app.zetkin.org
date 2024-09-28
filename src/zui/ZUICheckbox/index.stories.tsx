import { Meta, StoryFn } from '@storybook/react';

import ZUICheckbox from '.';

export default {
  component: ZUICheckbox,
  title: 'Atoms/ZUICheckbox',
} as Meta<typeof ZUICheckbox>;

const Template: StoryFn<typeof ZUICheckbox> = (args) => (
  <ZUICheckbox checked={args.checked} size={args.size} />
);

export const basic = Template.bind({});
basic.args = {
  checked: true,
  size: 1,
};
