import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Dialog } from '@mui/material';
import { Add } from '@mui/icons-material';

import ZUIAutocomplete from './index';
import ZUIText from '../ZUIText';
import ZUIButton from '../ZUIButton';

const meta: Meta<typeof ZUIAutocomplete> = {
  component: ZUIAutocomplete,
  title: 'Components/ZUIAutocomplete',
};
export default meta;

type Story = StoryObj<typeof ZUIAutocomplete>;

export const Basic: Story = {
  args: {
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
        onChange={(newSelection) => {
          if ('label' in newSelection) {
            setSelection(newSelection);
          }
        }}
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
        onChange={(newSelection) => {
          if ('length' in newSelection) {
            setSelection(newSelection);
          }
        }}
        value={selection}
      />
    );
  },
};

export const Subtitles: Story = {
  args: {
    options: [
      { label: 'Clara', subtitle: 'Zetkin' },
      { label: 'Angela', subtitle: 'Davis' },
      { label: 'Maya', subtitle: 'Angelou' },
      { label: 'Huey', subtitle: 'P Newton' },
    ],
  },
  render: Basic.render,
};

export const LastItemIsAction: Story = {
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
          onChange={(newSelection) => {
            if ('label' in newSelection) {
              setSelection(newSelection);
            }
          }}
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
  args: { ...Basic.args, checkboxes: true, multiple: true },
  render: Multiple.render,
};
