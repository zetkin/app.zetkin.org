import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUITextEditor from 'zui/ZUITextEditor/index';

export default {
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  component: ZUITextEditor,
  title: 'Organisms/TextEditor',
} as ComponentMeta<typeof ZUITextEditor>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ZUITextEditor> = (args) => (
  <ZUITextEditor {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = { fileUploads: [] };
