import { Meta, StoryFn } from '@storybook/react';

import ZUIRatingChart from '.';

export default {
  component: ZUIRatingChart,
  title: 'Atoms/ZUIRatingChart',
} as Meta<typeof ZUIRatingChart>;

const Template: StoryFn<typeof ZUIRatingChart> = (args) => (
  <ZUIRatingChart {...args} />
);

export const RatingChartBasic = Template.bind({});
RatingChartBasic.args = {
  data: [90, 20, 30, 10, 60],
  description: 'Scale: 1 (Disappointing) → 5 (Amazing)',
  title: 'How would you rate the overall experience of the assignment? ',
  visualizationHeight: 50,
};

export const RatingChartLowNumbers = Template.bind({});
RatingChartLowNumbers.args = {
  data: [0, 7, 3, 3, 4],
  description: 'Rate from 1 to 10 being 1 de easiest',
  title: 'How easy was it to use our website?',
  visualizationHeight: 50,
};

export const RatingChartAverageFour = Template.bind({});
RatingChartAverageFour.args = {
  data: [0, 8, 12, 34, 28],
  description: 'The average should be 4',
  visualizationHeight: 50,
};
