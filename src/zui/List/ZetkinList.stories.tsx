import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ListItem, ListItemText } from '@material-ui/core';

import ZetkinList from './ZetkinList';

export default {
  component: ZetkinList,
  title: 'Atoms/ZetkinList',
} as ComponentMeta<typeof ZetkinList>;

const Template: ComponentStory<typeof ZetkinList> = (args) => (
  <ZetkinList
    initialLength={args.initialLength}
    showMoreStep={args.showMoreStep}
  >
    {args.children}
  </ZetkinList>
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
