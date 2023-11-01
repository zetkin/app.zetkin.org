import Mapping from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Mapping,
  title: 'Mapping',
} as ComponentMeta<typeof Mapping>;

const Template: ComponentStory<typeof Mapping> = (args) => (
  <Mapping firstRowIsHeaders={args.firstRowIsHeaders} rows={args.rows} />
);

export const firstRowIsHeaders = Template.bind({});
firstRowIsHeaders.args = {
  firstRowIsHeaders: true,
  rows: [
    { data: ['Name', 'Last name', 'Email', 'Age'] },
    { data: ['Angela', 'Davies', 'angela@gmail.com', 34] },
    { data: ['Maya', 'Angelou', 'maya@gmail.com', 66] },
    { data: ['Rosa', 'Parks', 'rosa@gmail.com', 81] },
    { data: ['Huey', 'P Newton', 'huey@gmail.com', 51] },
  ],
};
export const firstRowIsData = Template.bind({});
firstRowIsData.args = {
  firstRowIsHeaders: false,
  rows: [
    { data: ['Angela', 'Davies', 'angela@gmail.com', 34] },
    { data: ['Maya', 'Angelou', 'maya@gmail.com', 66] },
    { data: ['Rosa', 'Parks', 'rosa@gmail.com', 81] },
    { data: ['Huey', 'P Newton', 'huey@gmail.com', 51] },
  ],
};
