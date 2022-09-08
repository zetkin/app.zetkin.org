import { ComponentMeta, ComponentStory } from '@storybook/react';

import AutoTextArea from '.';

export default {
  component: AutoTextArea,
  title: 'Atoms/AutoTextArea',
} as ComponentMeta<typeof AutoTextArea>;

const Template: ComponentStory<typeof AutoTextArea> = (args) => (
  <AutoTextArea
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
