import { ComponentMeta, ComponentStory } from '@storybook/react';

import SmartSearchSankeyDiagram from '.';
import { SEGMENT_KIND, SEGMENT_STYLE } from './types';

export default {
  component: SmartSearchSankeyDiagram,
  title: 'SmartSearchSankeyDiagram',
} as ComponentMeta<typeof SmartSearchSankeyDiagram>;

const Template: ComponentStory<typeof SmartSearchSankeyDiagram> = (args) => {
  return <SmartSearchSankeyDiagram {...args} />;
};

export const basic = Template.bind({});
basic.args = {
  segments: [
    {
      kind: SEGMENT_KIND.ENTRY,
      style: SEGMENT_STYLE.FILL,
      width: 0.8,
    },
    {
      kind: SEGMENT_KIND.ADD,
      main: {
        style: SEGMENT_STYLE.FILL,
        width: 0.8,
      },
      side: {
        style: SEGMENT_STYLE.FILL,
        width: 0.2,
      },
    },
    {
      kind: SEGMENT_KIND.SUB,
      main: {
        style: SEGMENT_STYLE.FILL,
        width: 0.7,
      },
      side: {
        style: SEGMENT_STYLE.FILL,
        width: 0.3,
      },
    },
    {
      kind: SEGMENT_KIND.EXIT,
      style: SEGMENT_STYLE.FILL,
      width: 0.7,
    },
  ],
};

export const pseudo = Template.bind({});
pseudo.args = {
  segments: [
    {
      kind: SEGMENT_KIND.ENTRY,
      style: SEGMENT_STYLE.STROKE,
      width: 1,
    },
    {
      kind: SEGMENT_KIND.PSEUDO_ADD,
      main: {
        style: SEGMENT_STYLE.STROKE,
        width: 1,
      },
      side: {
        style: SEGMENT_STYLE.STROKE,
        width: 1,
      },
    },
    {
      kind: SEGMENT_KIND.PSEUDO_SUB,
      main: {
        style: SEGMENT_STYLE.STROKE,
        width: 1,
      },
      side: {
        style: SEGMENT_STYLE.STROKE,
        width: 1,
      },
    },
    {
      kind: SEGMENT_KIND.EXIT,
      style: SEGMENT_STYLE.STROKE,
      width: 1,
    },
  ],
};

export const mixed = Template.bind({});
mixed.args = {
  segments: [
    {
      kind: SEGMENT_KIND.EMPTY,
    },
    {
      kind: SEGMENT_KIND.PSEUDO_ADD,
      main: null,
      side: {
        style: SEGMENT_STYLE.STROKE,
        width: 1,
      },
    },
    {
      kind: SEGMENT_KIND.PSEUDO_ADD,
      main: {
        style: SEGMENT_STYLE.STROKE,
        width: 1,
      },
      side: {
        style: SEGMENT_STYLE.FILL,
        width: 1,
      },
    },
    {
      kind: SEGMENT_KIND.SUB,
      main: {
        style: SEGMENT_STYLE.FILL,
        width: 0.7,
      },
      side: {
        style: SEGMENT_STYLE.FILL,
        width: 0.3,
      },
    },
    {
      kind: SEGMENT_KIND.EXIT,
      style: SEGMENT_STYLE.FILL,
      width: 0.7,
    },
  ],
};
