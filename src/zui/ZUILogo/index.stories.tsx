import { Meta, StoryFn } from '@storybook/react';

import ZUILogo from '.';

export default {
  component: ZUILogo,
  title: 'Old/ZUILogo',
} as Meta<typeof ZUILogo>;

const Template: StoryFn<typeof ZUILogo> = (args) => (
  <ZUILogo color={args.color} htmlColor={args.htmlColor} size={args.size} />
);

export const basic = Template.bind({});

export const color = Template.bind({});
color.args = {
  color: 'primary',
};

export const htmlColor = Template.bind({});
htmlColor.args = {
  htmlColor: '#33ff5e',
};

export const size = Template.bind({});
size.args = {
  size: 200,
};
