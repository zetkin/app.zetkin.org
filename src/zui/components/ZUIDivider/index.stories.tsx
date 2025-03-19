import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import { CatchingPokemon, Surfing } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import ZUIDivider from '.';
import ZUIText from 'zui/components/ZUIText';

const meta: Meta<typeof ZUIDivider> = {
  component: ZUIDivider,
  title: 'Components/ZUIDivider',
};
export default meta;
type Story = StoryObj<typeof ZUIDivider>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  decorators: [
    () => (
      <Paper>
        <Box sx={{ padding: '1rem' }}>
          <ZUIText>
            This is some text above a full width variant divider
          </ZUIText>
        </Box>
        <ZUIDivider />
        <Box sx={{ padding: '1rem' }}>
          <ZUIText>This is some text in between two dividers</ZUIText>
        </Box>
        <ZUIDivider variant="middle" />
        <Box sx={{ padding: '1rem' }}>
          <ZUIText>This is some text below a middle variant divider</ZUIText>
        </Box>
      </Paper>
    ),
  ],
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  decorators: [
    () => (
      <Paper>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
          <Box sx={{ padding: '0.5rem' }}>
            <Surfing color="secondary" />
          </Box>
          <ZUIDivider flexItem orientation="vertical" variant="middle" />
          <Box sx={{ padding: '0.5rem' }}>
            <CatchingPokemon color="secondary" />
          </Box>
          <ZUIDivider flexItem orientation="vertical" />
          <Box sx={{ padding: '0.5rem' }}>
            <ZUIText>
              Two vertical dividers, one middle variant and one full width
            </ZUIText>
          </Box>
        </Box>
      </Paper>
    ),
  ],
};
