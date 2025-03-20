import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import ZUIBarChartVertical from '.';

export default {
  component: ZUIBarChartVertical,
  title: 'Components/ZUIBarChartVertical',
} as Meta<typeof ZUIBarChartVertical>;

const Template: StoryFn<typeof ZUIBarChartVertical> = (args) => (
  <ZUIBarChartVertical {...args} />
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

export const BarChartQuarter = Template.bind({});
BarChartQuarter.args = {
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

export const BarChartMonths = Template.bind({});
BarChartMonths.args = {
  data: Array.from({ length: 12 }, (e, i) => {
    return {
      label: `Month of year no ${i + 1}`,
      value: Math.round(Math.random() * 1000),
    };
  }),
  description: 'Households visited each month',
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
  description: 'Households visited each of the first 90 days',
  maxValue: 10000,
  title: 'Households visited, normalized',
  visualizationHeight: 100,
};

export const BarChartNegativeValues = Template.bind({});
BarChartNegativeValues.args = {
  data: Array.from({ length: 90 }, (e, i) => {
    return {
      label: `Day ${i + 1}`,
      value: Math.round(Math.random() * 10) - 5,
    };
  }),
  description: 'Household rating compared to last year',
  title: 'Rating change',
};
