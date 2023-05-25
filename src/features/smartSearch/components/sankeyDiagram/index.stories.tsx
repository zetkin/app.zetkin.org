import { Box } from '@mui/material';
import { Meta, Story } from '@storybook/react';

import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import { SankeySegment, SEGMENT_KIND, SEGMENT_STYLE } from './types';

export default {
  title: 'Smart Search Sankey Diagram',
} as Meta;

const Template: Story<{ segments: SankeySegment[] }> = (args) => {
  return (
    <Box>
      {args.segments.map((seg, index) => (
        <SmartSearchSankeySegment key={index} segment={seg} />
      ))}
    </Box>
  );
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
