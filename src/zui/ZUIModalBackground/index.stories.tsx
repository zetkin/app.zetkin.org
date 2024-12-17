import { Meta, StoryFn } from '@storybook/react';

import ZUIModalBackground from '.';

export default {
  component: ZUIModalBackground,
  title: 'ZUIModalBackground',
} as Meta<typeof ZUIModalBackground>;

const Template: StoryFn<typeof ZUIModalBackground> = (args) => {
  return <ZUIModalBackground {...args} />;
};

export const basic = Template.bind({});
basic.args = {
  height: 300,
  width: 500,
};
