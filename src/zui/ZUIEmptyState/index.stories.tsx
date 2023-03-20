import ZUIEmptyState from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ZUIEmptyState,
  title: 'ZUIEmptyState',
} as ComponentMeta<typeof ZUIEmptyState>;

const Template: ComponentStory<typeof ZUIEmptyState> = (args) => {
  return (
    <ZUIEmptyState
      href={args.href}
      linkMessage={args.linkMessage}
      message={args.message}
    />
  );
};

export const basic = Template.bind({});
basic.args = {
  message: 'This is empty!!',
};

export const withLink = Template.bind({});
withLink.args = {
  href: '/',
  linkMessage: 'But you might find it here!',
  message: 'This page is empty',
};
