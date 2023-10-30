import { ComponentMeta, ComponentStory } from '@storybook/react';

import MappingRow from './MappingRow';

export default {
  component: MappingRow,
  title: 'MappingRow',
} as ComponentMeta<typeof MappingRow>;

const Template: ComponentStory<typeof MappingRow> = (args) => (
  <MappingRow column={args.column} fields={args.fields} title={args.title} />
);

export const basic = Template.bind({});
basic.args = {
  column: [
    1,
    34,
    1,
    null,
    34,
    5,
    7,
    34,
    234234,
    2,
    56,
    246,
    31,
    null,
    34,
    1,
    234,
    6,
    7,
    745,
    232,
    124,
    634,
    123,
    213,
    4,
    54,
    2,
  ],
  fields: ['Tags', 'First name', 'Last name', 'Organization'],
  title: 'id',
};
