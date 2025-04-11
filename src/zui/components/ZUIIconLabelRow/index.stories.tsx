import { Meta, StoryObj } from '@storybook/react';
import { CatchingPokemon, FoodBank, Surfing } from '@mui/icons-material';

import ZUIIconLabelRow from './index';

const meta: Meta<typeof ZUIIconLabelRow> = {
  component: ZUIIconLabelRow,
  title: 'Components/ZUIIconLabelRow',
};
export default meta;

type Story = StoryObj<typeof ZUIIconLabelRow>;

export const Medium: Story = {
  args: {
    iconLabels: [
      {
        icon: Surfing,
        label: 'Surfing',
      },
      {
        icon: CatchingPokemon,
        label: 'Pokemon',
      },
      {
        icon: FoodBank,
        label: 'Food',
      },
    ],
  },
};

export const Small: Story = {
  args: { ...Medium.args, size: 'small' },
};

export const Large: Story = {
  args: { ...Medium.args, size: 'large' },
};

export const Secondary: Story = {
  args: { ...Medium.args, color: 'secondary' },
};

export const Danger: Story = {
  args: { ...Medium.args, color: 'danger' },
};
