import ZUISuffixedNumber from '.';
import { Meta, StoryFn } from '@storybook/react';

export default {
  component: ZUISuffixedNumber,
  title: 'ZUISuffixedNumber',
} as Meta<typeof ZUISuffixedNumber>;

const Template: StoryFn<typeof ZUISuffixedNumber> = (args) => {
  return <ZUISuffixedNumber number={args.number} />;
};

export const basic = Template.bind({});
basic.args = { number: 54321 };
