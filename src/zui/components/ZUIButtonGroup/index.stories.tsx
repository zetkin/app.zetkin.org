import { Home, MoreVert } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import ZUIButtonGroup from './index';

const meta: Meta<typeof ZUIButtonGroup> = {
  component: ZUIButtonGroup,
  title: 'Components/ZUIButtonGroup',
};
export default meta;

type Story = StoryObj<typeof ZUIButtonGroup>;

export const PrimaryHorizontal: Story = {
  args: {
    buttons: [{ label: 'Start' }, { label: 'Cancel' }, { label: 'Save' }],
  },
};

export const PrimaryHorizontalWithIcon: Story = {
  args: {
    buttons: [{ label: 'Publish' }, { icon: MoreVert }],
    orientation: 'horizontal',
  },
};

export const SecondaryHorizontal: Story = {
  args: {
    buttons: [{ label: 'Draw' }, { label: 'Location' }, { label: 'Settings' }],
    variant: 'secondary',
  },
};

export const TertiaryHorizontal: Story = {
  args: {
    buttons: [{ label: 'Move' }, { label: 'Transform' }, { label: 'Undo' }],
    variant: 'tertiary',
  },
};

export const PrimaryVertical: Story = {
  args: {
    buttons: [{ label: 'Lists' }, { label: 'Events' }, { label: 'Emails' }],
    orientation: 'vertical',
  },
};

export const PrimaryVerticalWithIcon: Story = {
  args: {
    buttons: [{ label: 'Settings' }, { icon: Home }],
    orientation: 'vertical',
  },
};

export const SecondaryVertical: Story = {
  args: {
    buttons: [{ label: 'Start' }, { label: 'Cancel' }, { label: 'Save' }],
    orientation: 'vertical',
    variant: 'secondary',
  },
};

export const TertiaryVertical: Story = {
  args: {
    buttons: [{ label: 'Above' }, { label: 'Middle' }, { label: 'Below' }],
    orientation: 'vertical',
    variant: 'tertiary',
  },
};
