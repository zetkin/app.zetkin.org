import ZUIPlainChangeIndicator from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ZUIPlainChangeIndicator,
  title: 'Import/ZUIPlainChangeIndicator',
} as ComponentMeta<typeof ZUIPlainChangeIndicator>;

const Template: ComponentStory<typeof ZUIPlainChangeIndicator> = (args) => (
  <ZUIPlainChangeIndicator
    count={args.count}
    desc={args.desc}
    fieldName={args.fieldName}
  />
);

export const firstName = Template.bind({});
firstName.args = {
  count: 7,
  desc: 'people will recieve changes to their',
  fieldName: 'First name',
};

export const lastName = Template.bind({});
lastName.args = {
  count: 43,
  desc: 'people will recieve changes to their',
  fieldName: 'Last name',
};
