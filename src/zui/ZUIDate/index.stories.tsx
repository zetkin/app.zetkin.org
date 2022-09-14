import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIDate from '.';

export default {
  component: ZUIDate,
  title: 'Atoms/ZUIDate',
} as ComponentMeta<typeof ZUIDate>;

const Template: ComponentStory<typeof ZUIDate> = (args) => (
  <ZUIDate datetime={args.datetime} />
);

export const basic = Template.bind({});
basic.args = {
  datetime: new Date().toISOString(),
};
