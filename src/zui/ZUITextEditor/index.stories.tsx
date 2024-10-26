import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import ZUITextEditor from 'zui/ZUITextEditor/index';

export default {
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  component: ZUITextEditor,
  title: 'Old/ZUITextEditor',
} as Meta<typeof ZUITextEditor>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof ZUITextEditor> = (args) => (
  <ZUITextEditor {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = { fileUploads: [] };
