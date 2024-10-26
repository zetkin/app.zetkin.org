import { ListItem, ListItemText } from '@mui/material';
import { Meta, StoryFn } from '@storybook/react';

import ZUIList from '.';

export default {
  component: ZUIList,
  title: 'Old/ZUIList',
} as Meta<typeof ZUIList>;

const Template: StoryFn<typeof ZUIList> = (args) => (
  <ZUIList initialLength={args.initialLength} showMoreStep={args.showMoreStep}>
    {args.children}
  </ZUIList>
);

const list = [
  'Dirty Dancing',
  'Thelma & Louise',
  'Barb Wire',
  'Blues Brothers',
  'Pulp Fiction',
  'Robin Hood: Prince of Thieves',
];

const children = list.map((item, index) => (
  <ListItem key={index}>
    <ListItemText>{item}</ListItemText>
  </ListItem>
));

export const basic = Template.bind({});
basic.args = {
  children: children,
};

export const initialLength = Template.bind({});
initialLength.args = {
  children: children,
  initialLength: 3,
};

export const showMoreStep = Template.bind({});
showMoreStep.args = {
  children: children,
  initialLength: 2,
  showMoreStep: 2,
};
