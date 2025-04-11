import { Meta, StoryFn } from '@storybook/react';

import ZUISuffixedNumber from '.';

export default {
  component: ZUISuffixedNumber,
  title: 'Other/ZUISuffixedNumber',
} as Meta<typeof ZUISuffixedNumber>;

const Template: StoryFn<typeof ZUISuffixedNumber> = (args) => {
  return <ZUISuffixedNumber number={args.number} />;
};

export const basic = Template.bind({});
basic.args = { number: 54321 };
