import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Dialog } from '@mui/material';
import { Add } from '@mui/icons-material';

import ZUIAutocomplete from './index';
import ZUIText from '../ZUIText';
import ZUIButton from '../ZUIButton';
import ZUIPersonAvatar from '../ZUIPersonAvatar';

const meta: Meta<typeof ZUIAutocomplete> = {
  component: ZUIAutocomplete,
  title: 'Components/ZUIAutocomplete',
};
export default meta;

type Story = StoryObj<typeof ZUIAutocomplete>;

export const Basic: Story = {
  args: {
    label: 'Add assignee',
    options: [
      { label: 'Clara Zetkin' },
      { label: 'Angela Davis' },
      { label: 'Maya Angelou' },
      { label: 'Huey P Newton' },
    ],
  },
  render: function Render(args) {
    const [selection, setSelection] = useState<{ label: string } | null>(null);
    return (
      <ZUIAutocomplete
        {...args}
        multiple={false}
        onChange={(newSelection) => setSelection(newSelection)}
        value={selection}
      />
    );
  },
};

export const Multiple: Story = {
  args: Basic.args,
  render: function Render(args) {
    const [selection, setSelection] = useState<{ label: string }[]>([]);
    return (
      <ZUIAutocomplete
        {...args}
        multiple={true}
        onChange={(newSelection) => setSelection(newSelection)}
        value={selection}
      />
    );
  },
};

export const Subtitles: Story = {
  args: {
    ...Basic.args,
    options: [
      { label: 'Clara Zetkin', subtitle: 'claraZzz@riseup.net' },
      { label: 'Angela Davis', subtitle: 'angela.davis@gmail.com' },
      { label: 'Maya Angelou', subtitle: 'maya_1975@network.net' },
      { label: 'Huey P Newton', subtitle: 'huey@hotmail.com' },
    ],
  },
  render: Basic.render,
};

export const WithAction: Story = {
  args: Basic.args,
  render: function Render(args) {
    const [selection, setSelection] = useState<{ label: string } | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    return (
      <>
        <ZUIAutocomplete
          {...args}
          action={{
            icon: Add,
            label: 'Add person',
            onClick: () => setDialogOpen(true),
          }}
          multiple={false}
          onChange={(newSelection) => setSelection(newSelection)}
          value={selection}
        />
        <Dialog open={dialogOpen}>
          <Box display="flex" flexDirection="column" gap="1rem" padding={2}>
            <ZUIText>Example dialog</ZUIText>
            <ZUIButton
              label="Close"
              onClick={() => setDialogOpen(false)}
              variant="primary"
            />
          </Box>
        </Dialog>
      </>
    );
  },
};

export const Checkboxes: Story = {
  args: { ...Basic.args, checkboxes: true },
  render: function Render(args) {
    const [selection, setSelection] = useState<{ label: string } | null>(null);
    return (
      <ZUIAutocomplete
        {...args}
        multiple={false}
        onChange={(newSelection) => setSelection(newSelection)}
        value={selection}
      />
    );
  },
};

export const AvatarsAndSubtitles: Story = {
  args: {
    ...Basic.args,
    options: [
      {
        label: 'Clara Zetkin',
        picture: (
          <ZUIPersonAvatar firstName="Clara" id={12} lastName="Zetkin" />
        ),
        subtitle: 'claraZzz@riseup.net',
      },
      {
        label: 'Angela Davis',
        picture: (
          <ZUIPersonAvatar firstName="Angela" id={42} lastName="Davis" />
        ),
        subtitle: 'angela.davis@gmail.com',
      },
      {
        label: 'Maya Angelou',
        picture: <ZUIPersonAvatar firstName="Maya" id={5} lastName="Angelou" />,
        subtitle: 'maya_1975@network.net',
      },
      {
        label: 'Huey P Newton',
        picture: <ZUIPersonAvatar firstName="Huey" id={98} lastName="Newton" />,
        subtitle: 'huey@hotmail.com',
      },
    ],
  },
  render: Basic.render,
};

export const WithCustomFilterFunction: Story = {
  args: Subtitles.args,
  render: function Render(args) {
    const [selection, setSelection] = useState<{ label: string } | null>(null);
    return (
      <ZUIAutocomplete
        {...args}
        filterOptions={(options, { inputValue }) => {
          const filtered = options.filter(
            (item) =>
              item.subtitle?.toLocaleLowerCase().includes(inputValue) ||
              item.label.toLocaleLowerCase().includes(inputValue)
          );
          return filtered || options;
        }}
        multiple={false}
        onChange={(newSelection) => setSelection(newSelection)}
        value={selection}
      />
    );
  },
};

export const MultipleWithAvatarsAndCheckboxesAndSubtitles: Story = {
  args: AvatarsAndSubtitles.args,
  render: Multiple.render,
};
