import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZetkinDate from './ZetkinDate';

export default {
  component: ZetkinDate,
  title: 'Atoms/ZetkinDate',
} as ComponentMeta<typeof ZetkinDate>;

const Template: ComponentStory<typeof ZetkinDate> = (args) => (
  <ZetkinDate datetime={args.datetime} />
);

export const basic = Template.bind({});
basic.args = {
  datetime: new Date().toISOString(),
};
