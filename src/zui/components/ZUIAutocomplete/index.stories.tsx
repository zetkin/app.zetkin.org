import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Dialog } from '@mui/material';
import { Add } from '@mui/icons-material';

import ZUIAutocomplete from './index';
import ZUIText from '../ZUIText';
import ZUIButton from '../ZUIButton';
import ZUIAvatar from '../ZUIAvatar';

const meta: Meta<typeof ZUIAutocomplete> = {
  component: ZUIAutocomplete,
  title: 'Components/ZUIAutocomplete',
};
export default meta;

type Story = StoryObj<typeof ZUIAutocomplete>;

export const Basic: Story = {
  args: {
    label: 'Activists',
    options: [
      { label: 'Clara' },
      { label: 'Angela' },
      { label: 'Maya' },
      { label: 'Huey' },
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
      { label: 'Clara', subtitle: 'Zetkin' },
      { label: 'Angela', subtitle: 'Davis' },
      { label: 'Maya', subtitle: 'Angelou' },
      { label: 'Huey', subtitle: 'P Newton' },
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

export const AvatarsAndSubtitles: Story = {
  args: {
    ...Basic.args,
    options: [
      {
        label: 'Clara',
        picture: <ZUIAvatar firstName="Clara" id={12} lastName="Zetkin" />,
        subtitle: 'Zetkin',
      },
      {
        label: 'Angela',
        picture: <ZUIAvatar firstName="Angela" id={42} lastName="Davis" />,
        subtitle: 'Davis',
      },
      {
        label: 'Maya',
        picture: <ZUIAvatar firstName="Maya" id={5} lastName="Angelou" />,
        subtitle: 'Angelou',
      },
      {
        label: 'Huey',
        picture: <ZUIAvatar firstName="Huey" id={98} lastName="Newton" />,
        subtitle: 'P Newton',
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
