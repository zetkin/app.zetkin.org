import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIDatePicker from '.';

export default {
  component: ZUIDatePicker,
  title: 'Molecules/ZUIDatePicker',
} as ComponentMeta<typeof ZUIDatePicker>;

const Template: ComponentStory<typeof ZUIDatePicker> = () => (
  <ZUIDatePicker date={null} />
);

export const basic = Template.bind({});
basic.args = {};
