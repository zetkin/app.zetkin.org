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
  question: 'Question with a rating answers...',
  svgHeight: 50,
  values: [90, 20, 30, 10, 60],
};

export const RatingChartLowNumbers = Template.bind({});
RatingChartLowNumbers.args = {
  question: 'Low rating question...',
  svgHeight: 50,
  values: [0, 1, 2, 3, 4],
};
