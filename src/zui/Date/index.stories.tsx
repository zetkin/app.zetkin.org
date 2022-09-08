import { ComponentMeta, ComponentStory } from '@storybook/react';

import Date from '.';

export default {
  component: Date,
  title: 'Atoms/Date',
} as ComponentMeta<typeof Date>;

const Template: ComponentStory<typeof Date> = (args) => (
  <Date datetime={args.datetime} />
);

export const basic = Template.bind({});
basic.args = {
  datetime: new Date().toISOString(),
};
