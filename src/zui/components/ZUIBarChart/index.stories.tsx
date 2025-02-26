import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import ZUIBarChart from '.';

export default {
  component: ZUIBarChart,
  title: 'Components/ZUIBarChart',
} as Meta<typeof ZUIBarChart>;

const Template: StoryFn<typeof ZUIBarChart> = (args) => (
  <ZUIBarChart {...args} />
);

export const BarChartBasic = Template.bind({});
BarChartBasic.args = {
  title: 'Area households',
  description: 'Number of households in each area',
  visualizationHeight: 50,
  data: [
    {
      label: 'North',
      value: 50,
    },
    {
      label: 'East',
      value: 90,
    },
    {
      label: 'South',
      value: 20,
    },
    {
      label: 'West',
      value: 60,
    },
  ],
};

export const BarChartMany = Template.bind({});
BarChartMany.args = {
  title: 'Area households',
  description: 'Number of households in each area',
  visualizationHeight: 50,
  data: Array.from({ length: 90 }, (e, i) => {
    return {
      label: `Area ${i + 1}`,
      value: Math.round(Math.random() * 100),
    };
  }),
};
