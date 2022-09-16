import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIAutoTextArea from '.';

export default {
  component: ZUIAutoTextArea,
  title: 'Atoms/ZUIAutoTextArea',
} as ComponentMeta<typeof ZUIAutoTextArea>;

const Template: ComponentStory<typeof ZUIAutoTextArea> = (args) => (
  <ZUIAutoTextArea
    onChange={args.onChange}
    placeholder={args.placeholder}
    value={args.value}
  />
);

export const basic = Template.bind({});
basic.args = {
  onChange: () => undefined,
  value: 'Text value',
};

export const placeholder = Template.bind({});
placeholder.args = {
  onChange: () => undefined,
  placeholder: 'Placeholder text',
  value: '',
};
