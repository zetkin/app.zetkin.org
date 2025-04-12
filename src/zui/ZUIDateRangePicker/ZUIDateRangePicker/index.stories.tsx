import { Meta, StoryFn } from '@storybook/react';

import ZUIDateRangePicker from '.';

export default {
  component: ZUIDateRangePicker,
  title: 'Other/ZUIDateRangePicker',
} as Meta<typeof ZUIDateRangePicker>;

const Template: StoryFn<typeof ZUIDateRangePicker> = () => (
  <ZUIDateRangePicker endDate={null} startDate={null} />
);

export const basic = Template.bind({});
basic.args = {};
