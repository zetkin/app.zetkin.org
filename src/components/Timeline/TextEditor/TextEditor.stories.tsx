import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TextEditor from 'components/Timeline/TextEditor/index';

export default {
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  component: TextEditor,
  title: 'Organisms/TextEditor',
} as ComponentMeta<typeof TextEditor>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TextEditor> = (args) => (
  <TextEditor {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {};
