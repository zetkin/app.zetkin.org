import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIDateRangePicker from '.';

export default {
  component: ZUIDateRangePicker,
  title: 'Molecules/ZUIDateRangePicker',
} as ComponentMeta<typeof ZUIDateRangePicker>;

const Template: ComponentStory<typeof ZUIDateRangePicker> = () => (
  <ZUIDateRangePicker endDate={null} startDate={null} />
);

export const basic = Template.bind({});
basic.args = {};
