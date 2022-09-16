import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ACTIONS } from './constants';
import ZUISpeedDial from '.';

export default {
  component: ZUISpeedDial,
  title: 'Molecules/ZUISpeedDial',
} as ComponentMeta<typeof ZUISpeedDial>;

const Template: ComponentStory<typeof ZUISpeedDial> = (args) => (
  <ZUISpeedDial actions={args.actions} />
);

export const basic = Template.bind({});
basic.args = {
  actions: [ACTIONS.CREATE_CAMPAIGN, ACTIONS.CREATE_EVENT, ACTIONS.CREATE_TASK],
};
