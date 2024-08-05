import { Meta, StoryFn } from '@storybook/react';

import ZUIDatePicker from '.';

export default {
  component: ZUIDatePicker,
} as Meta<typeof ZUIDatePicker>;

const Template: StoryFn<typeof ZUIDatePicker> = () => (
  <ZUIDatePicker date={null} />
);

export const basic = Template.bind({});
basic.args = {};
