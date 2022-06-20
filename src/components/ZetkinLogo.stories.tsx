import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZetkinLogo from './ZetkinLogo';

export default {
  component: ZetkinLogo,
  title: 'Atoms/ZetkinLogo',
} as ComponentMeta<typeof ZetkinLogo>;

const Template: ComponentStory<typeof ZetkinLogo> = (args) => (
  <ZetkinLogo color={args.color} htmlColor={args.htmlColor} size={args.size} />
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
