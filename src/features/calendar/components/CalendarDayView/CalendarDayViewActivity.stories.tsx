import { ComponentMeta, ComponentStory } from '@storybook/react';

import { event } from 'utils/testing/mocks/mockEvent';
import CalendarDayViewActivity, {
  STATUS_COLORS,
} from './CalendarDayViewActivity';

export default {
  component: CalendarDayViewActivity,
  title: 'Atoms/CalendarDayViewActivity',
} as ComponentMeta<typeof CalendarDayViewActivity>;

const Template: ComponentStory<typeof CalendarDayViewActivity> = () => {
  return (
    <CalendarDayViewActivity event={event} statusColor={STATUS_COLORS.GREEN} />
  );
};

export const basic = Template.bind({});
basic.args = {};
