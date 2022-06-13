import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ACTIONS } from './constants';
import ZetkinSpeedDial from '.';

export default {
  component: ZetkinSpeedDial,
  title: 'Molecules/ZetkinSpeedDial',
} as ComponentMeta<typeof ZetkinSpeedDial>;

const Template: ComponentStory<typeof ZetkinSpeedDial> = (args) => (
  <ZetkinSpeedDial actions={args.actions} />
);

export const basic = Template.bind({});
basic.args = {
  actions: [ACTIONS.CREATE_CAMPAIGN, ACTIONS.CREATE_EVENT, ACTIONS.CREATE_TASK],
};
