import { ComponentMeta, ComponentStory } from '@storybook/react';

import Logo from '.';

export default {
  component: Logo,
  title: 'Atoms/Logo',
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => (
  <Logo color={args.color} htmlColor={args.htmlColor} size={args.size} />
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
