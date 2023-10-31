import { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MappingRow from './MappingRow';

export default {
  component: MappingRow,
  title: 'MappingRow',
} as ComponentMeta<typeof MappingRow>;

const Template: ComponentStory<typeof MappingRow> = (args) => {
  const [checked, setChecked] = useState(false);
  const [mapping, setMapping] = useState(false);

  return (
    <MappingRow
      column={args.column}
      isEnabled={checked}
      onEnable={() => setChecked(!checked)}
      onMapValues={() => setMapping(!mapping)}
      zetkinFields={args.zetkinFields}
    />
  );
};

export const basic = Template.bind({});
basic.args = {
  column: {
    data: ['katt', 'hund', 'get', null, null, 'ko', 'gris', 'papegoja', null],
    id: 1,
    title: 'id',
  },
  zetkinFields: [
    { id: 1, needsMapping: true, title: 'Tags' },
    { id: 2, needsMapping: false, title: 'First name' },
    { id: 3, needsMapping: false, title: 'Last name' },
    { id: 4, needsMapping: true, title: 'Organization' },
  ],
};
