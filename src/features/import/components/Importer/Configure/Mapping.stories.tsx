import Mapping from './Mapping';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Mapping,
  title: 'Mapping',
} as ComponentMeta<typeof Mapping>;

const Template: ComponentStory<typeof Mapping> = (args) => (
  <Mapping rows={args.rows} />
);

export const basic = Template.bind({});
basic.args = {
  rows: [
    { data: ['Angela', 'Davies', 'angela@gmail.com', 34] },
    { data: ['Maya', 'Angelou', 'maya@gmail.com', 66] },
    { data: ['Rosa', 'Parks', 'rosa@gmail.com', 81] },
    { data: ['Huey', 'P Newton', 'huey@gmail.com', 51] },
  ],
};
