import { Box } from '@mui/material';
import { Meta, Story } from '@storybook/react';

import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import {
  SankeyConfig,
  SankeySegment,
  SEGMENT_KIND,
  SEGMENT_STYLE,
} from './types';

export default {
  title: 'Smart Search Sankey Diagram',
} as Meta;

type StoryArgs = SankeyConfig & {
  segments: SankeySegment[];
};

const Template: Story<StoryArgs> = (args) => {
  const { segments, ...config } = args;

  return (
    <Box>
      {segments.map((seg, index) => (
        <SmartSearchSankeySegment key={index} config={config} segment={seg} />
      ))}
    </Box>
  );
};

const defaultConfig = {
  arrowDepth: 10,
  arrowWidth: 20,
  color: '#cccccc',
  diagWidth: 200,
  highlightColor: '#ffcc00',
  lineWidth: 2,
  margin: 30,
  segHeight: 100,
};

const stats = {
  change: 0,
  input: 0,
  matches: 0,
  output: 0,
};

export const basic = Template.bind({});
basic.args = {
  ...defaultConfig,
  segments: [
    {
      kind: SEGMENT_KIND.ENTRY,
      stats,
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
      stats,
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
      stats,
    },
    {
      kind: SEGMENT_KIND.EXIT,
      output: 0,
      style: SEGMENT_STYLE.FILL,
      width: 0.7,
    },
  ],
};

export const pseudo = Template.bind({});
pseudo.args = {
  ...defaultConfig,
  segments: [
    {
      kind: SEGMENT_KIND.ENTRY,
      stats,
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
      stats,
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
      stats,
    },
    {
      kind: SEGMENT_KIND.EXIT,
      output: 0,
      style: SEGMENT_STYLE.STROKE,
      width: 1,
    },
  ],
};

export const mixed = Template.bind({});
mixed.args = {
  ...defaultConfig,
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
      stats,
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
      stats,
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
      stats,
    },
    {
      kind: SEGMENT_KIND.EXIT,
      output: 0,
      style: SEGMENT_STYLE.FILL,
      width: 0.7,
    },
  ],
};
