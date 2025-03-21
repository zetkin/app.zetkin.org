import { CatchingPokemon, MoreVert } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react/*';

import ZUIButtonGroup from './index';

const meta: Meta<typeof ZUIButtonGroup> = {
  component: ZUIButtonGroup,
  title: 'Components/ZUIButtonGroup',
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
    buttons: [{ label: 'Hallå' }, { icon: MoreVert }],
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
    buttons: [{ label: 'Hallå' }, { icon: CatchingPokemon }],
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
