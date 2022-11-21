import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIAnimatedNumber from '.';

export default {
  component: ZUIAnimatedNumber,
  title: 'Atoms/ZUIAnimatedNumber',
} as ComponentMeta<typeof ZUIAnimatedNumber>;

const Template: ComponentStory<typeof ZUIAnimatedNumber> = (args) => {
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
