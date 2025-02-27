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
  data: [
    {
      label: 'North part of town',
      value: 50,
    },
    {
      label: 'East part of town',
      value: 90,
    },
    {
      label: 'South part of town',
      value: 20,
    },
    {
      label: 'West part of town',
      value: 60,
    },
  ],
  description: 'Number of households in each area',
  title: 'Area households',
  visualizationHeight: 50,
};

export const BarChartMany = Template.bind({});
BarChartMany.args = {
  data: Array.from({ length: 90 }, (e, i) => {
    return {
      label: `Day ${i + 1}`,
      value: Math.round(Math.random() * 100),
    };
  }),
  description: 'Households visited each of the first 90 days',
  title: 'Households visited',
  visualizationHeight: 50,
};
