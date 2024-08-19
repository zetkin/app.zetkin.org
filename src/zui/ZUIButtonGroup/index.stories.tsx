import { CatchingPokemon, MoreVert } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react/*';

import ZUIButton from 'zui/ZUIButton';
import ZUIButtonGroup from './index';

const meta: Meta<typeof ZUIButtonGroup> = {
  component: ZUIButtonGroup,
};
export default meta;

type Story = StoryObj<typeof ZUIButtonGroup>;

export const PrimaryHorizontal: Story = {
  args: {
    children: (
      <>
        <ZUIButton label="Hallå" />
        <ZUIButton label="Nämen" />
        <ZUIButton label="Hej" />
      </>
    ),
  },
};

export const PrimaryHorizontalWithIcon: Story = {
  args: {
    children: (
      <>
        <ZUIButton label="Hallå" />
        <ZUIButton label={<MoreVert />} />
      </>
    ),
    orientation: 'horizontal',
  },
};

export const SecondaryHorizontal: Story = {
  args: {
    children: (
      <>
        <ZUIButton label="Hallå" />
        <ZUIButton label="Nämen" />
        <ZUIButton label="Hej" />
      </>
    ),
    variant: 'secondary',
  },
};

export const TertiaryHorizontal: Story = {
  args: {
    children: (
      <>
        <ZUIButton label="Hallå" />
        <ZUIButton label="Nämen" />
        <ZUIButton label="Hej" />
      </>
    ),
    variant: 'tertiary',
  },
};

export const PrimaryVertical: Story = {
  args: {
    children: (
      <>
        <ZUIButton label="Hallå" />
        <ZUIButton label="Nämen" />
        <ZUIButton label="Hej" />
      </>
    ),
    orientation: 'vertical',
  },
};

export const PrimaryVerticalWithIcon: Story = {
  args: {
    children: (
      <>
        <ZUIButton label="Hallå" />
        <ZUIButton label={<CatchingPokemon />} />
      </>
    ),
    orientation: 'vertical',
  },
};

export const SecondaryVertical: Story = {
  args: {
    children: (
      <>
        <ZUIButton label="Hallå" />
        <ZUIButton label="Nämen" />
        <ZUIButton label="Hej" />
      </>
    ),
    orientation: 'vertical',
    variant: 'secondary',
  },
};

export const TertiaryVertical: Story = {
  args: {
    children: (
      <>
        <ZUIButton label="Hallå" />
        <ZUIButton label="Nämen" />
        <ZUIButton label="Hej" />
      </>
    ),
    orientation: 'vertical',
    variant: 'tertiary',
  },
};
