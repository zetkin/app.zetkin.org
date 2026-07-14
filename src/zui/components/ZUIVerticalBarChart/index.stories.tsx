import { Meta, StoryFn } from '@storybook/nextjs';
import React from 'react';

import ZUIVerticalBarChart from '.';

export default {
  component: ZUIVerticalBarChart,
  title: 'Components/ZUIVerticalBarChart',
} as Meta<typeof ZUIVerticalBarChart>;

const Template: StoryFn<typeof ZUIVerticalBarChart> = (args) => (
  <ZUIVerticalBarChart {...args} />
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

export const BarChartNarrowBars = Template.bind({});
BarChartNarrowBars.args = {
  data: Array.from({ length: 90 }, (e, i) => {
    return {
      label: `Day ${i + 1}`,
      value: Math.round(Math.random() * 10000),
    };
  }),
  description: 'Households visited each of the first 90 days',
  title: 'Households visited',
  visualizationHeight: 50,
};

export const BarChartOverflow = Template.bind({});
BarChartOverflow.args = {
  data: Array.from({ length: 12 }, (e, i) => {
    return {
      label: `Month of year no ${i + 1}`,
      value: Math.round(Math.random() * 1000),
    };
  }),
  description: 'Households visited each month to show overflowing labels',
  title: 'Households visited this year',
  visualizationHeight: 50,
};

export const BarChartNoScale = Template.bind({});
BarChartNoScale.args = {
  data: Array.from({ length: 12 }, (e, i) => {
    return {
      label: `Month of year no ${i + 1}`,
      value: Math.round(Math.random() * 1000),
    };
  }),
  description: 'Households visited each month with hidden scale',
  hideScale: true,
  title: 'Households visited this year',
  visualizationHeight: 50,
};

export const BarChartMaxValue = Template.bind({});
BarChartMaxValue.args = {
  data: Array.from({ length: 90 }, (e, i) => {
    return {
      label: `Day ${i + 1}`,
      value: Math.round(Math.random() * 8000),
    };
  }),
  description:
    'Households visited each of the first 90 days using a maxValue of 10000',
  maxValue: 10000,
  title: 'Households visited, normalized',
  visualizationHeight: 100,
};
