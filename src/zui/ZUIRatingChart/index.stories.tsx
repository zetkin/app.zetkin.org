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
  question:
    'How would you rate the overall experience of the assignment? Scale: 1 (Disappointing) → 5 (Amazing)',
  svgHeight: 50,
  values: [90, 20, 30, 10, 60],
};

export const RatingChartLowNumbers = Template.bind({});
RatingChartLowNumbers.args = {
  question: 'How easy was it to use our website?',
  svgHeight: 50,
  values: [0, 7, 3, 3, 4],
};
