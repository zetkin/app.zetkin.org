import { Descendant } from 'slate';
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TextEditor from 'components/Timeline/TextEditor';

/* eslint-disable */
const initialValue: Descendant[] = [
  {
    type: 'paragraph',

    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      // @ts-ignore
      { text: 'much', italic: true },
      { text: ' better than a ' },
      // @ts-ignore
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text: ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    // @ts-ignore
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    // @ts-ignore
    align: 'left  ',
    children: [{ text: 'Try it out for yourself!' }],
  },
];
/* eslint-enable */

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
Primary.args = { initialValue };
