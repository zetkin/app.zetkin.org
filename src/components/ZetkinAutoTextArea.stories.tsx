import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZetkinAutoTextArea from './ZetkinAutoTextArea';

export default {
  component: ZetkinAutoTextArea,
  title: 'Atoms/ZetkinAutoTextArea',
} as ComponentMeta<typeof ZetkinAutoTextArea>;

const Template: ComponentStory<typeof ZetkinAutoTextArea> = (args) => (
  <ZetkinAutoTextArea
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
