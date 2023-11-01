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
  const [selectedZetkinFieldId, setSelectedZetkinFieldId] = useState('');
  const [currentlyMapping, setCurrentlyMapping] = useState<number | null>(null);

  return (
    <MappingRow
      column={args.column}
      currentlyMapping={currentlyMapping}
      isEnabled={checked}
      mappingResults={mappingResults}
      onEnable={() => {
        setChecked(!checked);
        setMappingResults(null);
        setSelectedZetkinFieldId('');
      }}
      onMapValues={() => {
        setCurrentlyMapping(args.column.id);
        setTimeout(() => {
          setMappingResults({ numMappedTo: 5, numPeople: 234 });
        }, 3000);
      }}
      onSelectField={(id: string) => {
        setSelectedZetkinFieldId(id);
        setMappingResults(null);
      }}
      selectedZetkinFieldId={selectedZetkinFieldId}
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
      needsMapping: true,
      title: 'Tags',
      type: ExperimentalFieldTypes.TAG,
    },
    {
      id: 2,
      needsMapping: false,
      title: 'First name',
      type: ExperimentalFieldTypes.BASIC,
    },
    {
      id: 3,
      needsMapping: false,
      title: 'Last name',
      type: ExperimentalFieldTypes.BASIC,
    },
    {
      id: 4,
      needsMapping: true,
      title: 'Organization',
      type: ExperimentalFieldTypes.ORGANIZATION,
    },
  ],
};
