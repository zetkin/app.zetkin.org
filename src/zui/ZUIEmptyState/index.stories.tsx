import ZUIEmptyState from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ZUIEmptyState,
  title: 'ZUIEmptyState',
} as ComponentMeta<typeof ZUIEmptyState>;

const Template: ComponentStory<typeof ZUIEmptyState> = () => {
  return <ZUIEmptyState message="This is empty!" />;
};

export const basic = Template.bind({});
