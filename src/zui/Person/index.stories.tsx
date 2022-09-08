import { ComponentMeta, ComponentStory } from '@storybook/react';

import { person } from '../../../utils/testing/mocks/mockPerson';
import Person from '.';

export default {
  component: Person,
  title: 'Atoms/Person',
} as ComponentMeta<typeof Person>;

const Template: ComponentStory<typeof Person> = (args) => (
  <Person
    id={args.id}
    link={args.link}
    name={args.name}
    showText={args.showText}
    size={args.size}
    subtitle={args.subtitle}
    tooltip={args.tooltip}
  />
);

export const basic = Template.bind({});
basic.args = {
  id: person.id,
  name: `${person.first_name} ${person.last_name}`,
};

export const noTooltip = Template.bind({});
noTooltip.args = {
  id: person.id,
  name: `${person.first_name} ${person.last_name}`,
  tooltip: false,
};

export const link = Template.bind({});
link.args = {
  id: person.id,
  link: true,
  name: `${person.first_name} ${person.last_name}`,
};

export const subtitle = Template.bind({});
subtitle.args = {
  id: person.id,
  name: `${person.first_name} ${person.last_name}`,
  showText: true,
  subtitle: 'Super cool person',
};

export const size = Template.bind({});
size.args = {
  id: person.id,
  name: `${person.first_name} ${person.last_name}`,
  size: 50,
};
