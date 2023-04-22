import { ComponentMeta, ComponentStory } from '@storybook/react';

import CalendarDayViewActivity from './CalendarDayViewActivity';
import { event } from 'utils/testing/mocks/mockEvent';

export default {
  component: CalendarDayViewActivity,
  title: 'Atoms/CalendarDayViewActivity',
} as ComponentMeta<typeof CalendarDayViewActivity>;

const Template: ComponentStory<typeof CalendarDayViewActivity> = (args) => {
  return <CalendarDayViewActivity event={event} />;
};

export const basic = Template.bind({});
basic.args = {

};
