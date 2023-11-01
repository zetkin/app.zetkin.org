import { ComponentMeta, ComponentStory } from '@storybook/react';

import SheetSettings from '.';
import { useState } from 'react';

export default {
  component: SheetSettings,
  title: 'Settings',
} as ComponentMeta<typeof SheetSettings>;

const Template: ComponentStory<typeof SheetSettings> = (args) => {
  const [checked, setChecked] = useState(false);
  const [selectedSheetId, setSelectedSheetId] = useState('');
  return (
    <SheetSettings
      firstRowIsHeaders={checked}
      onChangeFirstRowIsHeaders={() => setChecked(!checked)}
      onChangeSelectedSheet={(id: string) => setSelectedSheetId(id)}
      selectedSheet={selectedSheetId}
      sheets={args.sheets}
    />
  );
};

export const singleSheet = Template.bind({});
singleSheet.args = {
  sheets: [
    {
      data: [
        { data: ['Name', 'Last name', 'Email', 'Age'] },
        { data: ['Angela', 'Davies', 'angela@gmail.com', 34] },
        { data: ['Maya', 'Angelou', 'maya@gmail.com', 66] },
        { data: ['Rosa', 'Parks', 'rosa@gmail.com', 81] },
        { data: ['Huey', 'P Newton', 'huey@gmail.com', 51] },
      ],
      id: 1,
      title: 'Members',
    },
  ],
};

export const multipleSheets = Template.bind({});
multipleSheets.args = {
  sheets: [
    {
      data: [
        { data: ['Name', 'Last name', 'Email', 'Age'] },
        { data: ['Angela', 'Davies', 'angela@gmail.com', 34] },
        { data: ['Maya', 'Angelou', 'maya@gmail.com', 66] },
        { data: ['Rosa', 'Parks', 'rosa@gmail.com', 81] },
        { data: ['Huey', 'P Newton', 'huey@gmail.com', 51] },
      ],
      id: 1,
      title: 'Members',
    },
    {
      data: [
        { data: ['Name', 'Last name', 'Email', 'Age'] },
        { data: ['Kitty', 'Jonsson', 'kitty@gmail.com', 36] },
        { data: ['Lasse', 'Brandeby', 'lasse@gmail.com', 81] },
        { data: ['Pamela', 'Andersson', 'pamela@gmail.com', 61] },
        { data: ['Jane', 'Austen', 'jane@gmail.com', 102] },
      ],
      id: 2,
      title: 'Old Members',
    },
  ],
};
