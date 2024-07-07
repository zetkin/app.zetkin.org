import { Meta, StoryFn } from '@storybook/react';

import ZUIAnimatedNumber from '.';

export default {
  component: ZUIAnimatedNumber,
  title: 'Atoms/ZUIAnimatedNumber',
} as Meta<typeof ZUIAnimatedNumber>;

const Template: StoryFn<typeof ZUIAnimatedNumber> = (args) => {
  const value = args.value || 0;
  return (
    <div style={{ width: 400 }}>
      <ZUIAnimatedNumber {...args} value={value}>
        {(animatedValue) => <h1>{animatedValue}</h1>}
      </ZUIAnimatedNumber>
    </div>
  );
};

export const basic = Template.bind({});
basic.args = {};
