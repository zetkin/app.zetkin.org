import { CatchingPokemon, MoreVert } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react/*';

import ZUIButtonGroup from './index';

const meta: Meta<typeof ZUIButtonGroup> = {
  component: ZUIButtonGroup,
};
export default meta;

type Story = StoryObj<typeof ZUIButtonGroup>;

export const PrimaryHorizontal: Story = {
  args: {
    buttons: [{ label: 'Hallå' }, { label: 'Nämen' }, { label: 'Hej' }],
  },
};

export const PrimaryHorizontalWithIcon: Story = {
  args: {
    buttons: [{ label: 'Hallå' }, { label: <MoreVert /> }],
    orientation: 'horizontal',
  },
};

export const SecondaryHorizontal: Story = {
  args: {
    buttons: [{ label: 'Hallå' }, { label: 'Nämen' }, { label: 'Hej' }],
    variant: 'secondary',
  },
};

export const TertiaryHorizontal: Story = {
  args: {
    buttons: [{ label: 'Hallå' }, { label: 'Nämen' }, { label: 'Hej' }],
    variant: 'tertiary',
  },
};

export const PrimaryVertical: Story = {
  args: {
    buttons: [{ label: 'Hallå' }, { label: 'Nämen' }, { label: 'Hej' }],
    orientation: 'vertical',
  },
};

export const PrimaryVerticalWithIcon: Story = {
  args: {
    buttons: [{ label: 'Hallå' }, { label: <CatchingPokemon /> }],

    orientation: 'vertical',
  },
};

export const SecondaryVertical: Story = {
  args: {
    buttons: [{ label: 'Hallå' }, { label: 'Nämen' }, { label: 'Hej' }],
    orientation: 'vertical',
    variant: 'secondary',
  },
};

export const TertiaryVertical: Story = {
  args: {
    buttons: [{ label: 'Hallå' }, { label: 'Nämen' }, { label: 'Hej' }],
    orientation: 'vertical',
    variant: 'tertiary',
  },
};
