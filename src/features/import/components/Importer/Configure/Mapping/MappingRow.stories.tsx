import { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MappingRow, {
  ExperimentalFieldTypes,
  ExperimentalMappingResults,
} from './MappingRow';

export default {
  component: MappingRow,
  title: 'MappingRow',
} as ComponentMeta<typeof MappingRow>;

const Template: ComponentStory<typeof MappingRow> = (args) => {
  const [checked, setChecked] = useState(false);
  const [mappingResults, setMappingResults] =
    useState<ExperimentalMappingResults | null>(null);
  const [currentlyMapping, setCurrentlyMapping] = useState<number | null>(null);

  return (
    <MappingRow
      column={args.column}
      currentlyMapping={currentlyMapping}
      isSelected={checked}
      mappingResults={mappingResults}
      onCheck={() => {
        setChecked(!checked);
        setMappingResults(null);
      }}
      onMapValues={() => {
        setCurrentlyMapping(args.column.id);
        setTimeout(() => {
          setMappingResults({ numMappedTo: 5, numPeople: 234 });
        }, 3000);
      }}
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
    {
      id: 1,
      slug: 'tags',
      title: 'tags',
      type: ExperimentalFieldTypes.TAG,
    },
    {
      id: 2,
      slug: 'first_name',
      title: 'First name',
      type: ExperimentalFieldTypes.BASIC,
    },
    {
      id: 3,
      slug: 'last_name',
      title: 'Last name',
      type: ExperimentalFieldTypes.BASIC,
    },
    {
      id: 4,
      slug: 'org',
      title: 'Organization',
      type: ExperimentalFieldTypes.ORGANIZATION,
    },
  ],
};
