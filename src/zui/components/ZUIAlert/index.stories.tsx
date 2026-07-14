import { Meta, StoryObj } from '@storybook/nextjs';
import { Box, Stack } from '@mui/material';
import { useState } from 'react';

import ZUIAlert from './index';
import ZUIButton from '../ZUIButton';
import ZUISection from '../ZUISection';
import ZUIText from '../ZUIText';

const meta: Meta<typeof ZUIAlert> = {
  component: ZUIAlert,
  title: 'Components/ZUIAlert',
};
export default meta;

type Story = StoryObj<typeof ZUIAlert>;

export const Basic: Story = {
  args: {
    severity: 'info',
    title: 'This is the title to alert the user to something',
  },
};

export const Description: Story = {
  args: {
    ...Basic.args,
    description:
      'This is the description where we give a bit of context to whatever it is we are trying to alert the user to. It is a string so it will be rendered as one continuous text.',
  },
};

export const CloseButton: Story = {
  args: { ...Basic.args, onClose: () => null },
};

export const DescriptionAndCloseButton: Story = {
  args: { ...Description.args, onClose: () => null },
};

export const Button: Story = {
  args: {
    ...Description.args,
    button: { label: 'Click me', onClick: () => null },
  },
};

export const CloseButtonAndButton: Story = {
  args: {
    ...CloseButton.args,
    ...Button.args,
  },
};

export const VeryLongTitle: Story = {
  args: {
    ...Basic.args,
    title:
      'This is a very long title because we are not using a description so we are trying to fit a lot of information in here.',
  },
};

export const AnimatesOut: Story = {
  args: {
    ...CloseButton.args,
  },
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <Stack gap="0.5rem">
        <Box sx={{ justifySelf: 'flex-start' }}>
          <ZUIButton
            disabled={open}
            label="Show the alert"
            onClick={() => setOpen(!open)}
            variant="secondary"
          />
        </Box>
        <ZUIAlert
          description={args.description}
          onClose={() => setOpen(false)}
          open={open}
          severity="info"
          title={args.title}
        />
        <ZUISection
          renderContent={() => <ZUIText>With some content</ZUIText>}
          title="Another component"
        />
      </Stack>
    );
  },
};

export const AnimatesInAndOut: Story = {
  args: {
    ...CloseButton.args,
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <Stack gap="0.5rem">
        <Box sx={{ justifySelf: 'flex-start' }}>
          <ZUIButton
            disabled={open}
            label="Show the alert"
            onClick={() => setOpen(!open)}
            variant="secondary"
          />
        </Box>
        <ZUIAlert
          appear={true}
          description={args.description}
          onClose={() => setOpen(false)}
          open={open}
          severity="info"
          title={args.title}
        />
        <ZUISection
          renderContent={() => <ZUIText>With some content</ZUIText>}
          title="Another component"
        />
      </Stack>
    );
  },
};
