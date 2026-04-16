import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';

import ZUIMarkdownEditor from 'zui/ZUIMarkdownEditor/index';

export default {
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  component: ZUIMarkdownEditor,
  title: 'Other/ZUIMarkdownEditor',
} as Meta<typeof ZUIMarkdownEditor>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof ZUIMarkdownEditor> = (args) => (
  <ZUIMarkdownEditor {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = { fileUploads: [] };
