import ZUISuffixedNumber from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ZUISuffixedNumber,
  title: 'ZUISuffixedNumber',
} as ComponentMeta<typeof ZUISuffixedNumber>;

const Template: ComponentStory<typeof ZUISuffixedNumber> = (args) => {
  return <ZUISuffixedNumber number={args.number} />;
};

export const basic = Template.bind({ number: 54321 });
