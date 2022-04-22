import dayjs from 'dayjs';
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import mockUpdate from 'utils/testing/mocks/mockUpdate';
import Timeline from 'components/Timeline';

export default {
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  component: Timeline,
  title: 'Example/Timeline',
} as ComponentMeta<typeof Timeline>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Timeline> = (args) => (
  <Timeline {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  updates: Array.from(Array(30).keys()).map(() =>
    mockUpdate({
      created_at: dayjs()
        .subtract(Math.random() * 100, 'hours')
        .format(),
    })
  ),
};
