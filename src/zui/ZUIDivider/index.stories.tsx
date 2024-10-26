import { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import { CatchingPokemon, Surfing } from '@mui/icons-material';

import ZUIDivider from '.';
import ZUIText from 'zui/ZUIText';

const meta: Meta<typeof ZUIDivider> = {
  component: ZUIDivider,
  title: 'New Design System/ZUIDivider',
};
export default meta;
type Story = StoryObj<typeof ZUIDivider>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  decorators: [
    () => (
      <Box display="flex" flexDirection="column" gap={2}>
        <ZUIText>This is some text above a full width variant divider</ZUIText>
        <ZUIDivider />
        <ZUIText>This is some text in between two dividers</ZUIText>
        <ZUIDivider variant="middle" />
        <ZUIText>This is some text below a middle variant divider</ZUIText>
      </Box>
    ),
  ],
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  decorators: [
    () => (
      <Box alignItems="center" display="flex" gap={1}>
        <Surfing color="secondary" />
        <ZUIDivider flexItem orientation="vertical" variant="middle" />
        <CatchingPokemon color="secondary" />
        <ZUIDivider flexItem orientation="vertical" />
        <ZUIText>
          Two vertical dividers, one middle variant and one full width
        </ZUIText>
      </Box>
    ),
  ],
};
