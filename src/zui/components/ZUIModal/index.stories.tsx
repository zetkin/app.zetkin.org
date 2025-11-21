import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { useState } from 'react';

import ZUIButton from '../ZUIButton';
import ZUIText from '../ZUIText';
import ZUIModal from '.';

const meta: Meta<typeof ZUIModal> = {
  component: ZUIModal,
  title: 'Components/ZUIModal',
};
export default meta;

type Story = StoryObj<typeof ZUIModal>;

export const Auto: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <ZUIButton
          label="Open modal"
          onClick={() => setOpen(true)}
          variant="primary"
        />
        <ZUIModal
          {...args}
          onClose={() => setOpen(false)}
          open={open}
          primaryButton={{ label: 'Confirm', onClick: () => null }}
          secondaryButton={{ label: 'Cancel', onClick: () => setOpen(false) }}
          title="Modal title"
        >
          <Box
            sx={{
              backgroundColor: 'peachpuff',
              height: '1000px',
              width: '100%',
            }}
          >
            <ZUIText>Children go here</ZUIText>
          </Box>
        </ZUIModal>
      </>
    );
  },
};

export const Small: Story = {
  args: { size: 'small' },
  render: Auto.render,
};

export const Medium: Story = {
  args: { size: 'medium' },
  render: Auto.render,
};

export const Large: Story = {
  args: { size: 'large' },
  render: Auto.render,
};

export const Full: Story = {
  args: { size: 'full' },
  render: Auto.render,
};

export const NoChildrenAndNoOnclose: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <ZUIButton
          label="Open modal"
          onClick={() => setOpen(true)}
          variant="primary"
        />
        <ZUIModal
          open={open}
          primaryButton={{ label: 'Confirm', onClick: () => null }}
          title="Modal title"
        />
      </>
    );
  },
};

export const NoButtons: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <ZUIButton
          label="Open modal"
          onClick={() => setOpen(true)}
          variant="primary"
        />
        <ZUIModal
          {...args}
          onClose={() => setOpen(false)}
          open={open}
          title="Modal title"
        >
          <Box
            sx={{
              backgroundColor: 'peachpuff',
              height: '1000px',
              width: '100%',
            }}
          >
            <ZUIText>Children go here</ZUIText>
          </Box>
        </ZUIModal>
      </>
    );
  },
};
