import { ComponentMeta, ComponentStory } from '@storybook/react';

import MappingRow from './MappingRow';
import { useState } from 'react';

export default {
  component: MappingRow,
  title: 'MappingRow',
} as ComponentMeta<typeof MappingRow>;

const Template: ComponentStory<typeof MappingRow> = (args) => {
  const [enabled, setEnabled] = useState(false);
  const [selectedZetkinField, setSelectedZetkinField] = useState('');

  return (
    <MappingRow
      column={args.column}
      fields={args.fields}
      isEnabled={enabled}
      onEnable={() => setEnabled(!enabled)}
      onZetkinFieldSelect={(zetkinField: string) =>
        setSelectedZetkinField(zetkinField)
      }
      selectedZetkinField={selectedZetkinField}
      title={args.title}
    />
  );
};

export const basic = Template.bind({});
basic.args = {
  column: ['katt', 'hund', 'get', null, null, 'ko', 'gris', 'papegoja', null],
  fields: [
    { id: 1, title: 'Tags' },
    { id: 2, title: 'First name' },
    { id: 3, title: 'Last name' },
    { id: 4, title: 'Organization' },
  ],
  title: 'id',
};
