import { Meta, StoryObj } from '@storybook/react';
import { Box, Paper, Typography } from '@mui/material';

import ZUIDataChip from './index';
import ZUIDivider from '../ZUIDivider';
import ZUIText from '../ZUIText';

const meta: Meta<typeof ZUIDataChip> = {
  component: ZUIDataChip,
  title: 'Components/ZUIDataChip',
};
export default meta;

type Story = StoryObj<typeof ZUIDataChip>;

export const Basic: Story = {
  args: {
    color: 'grey',
    value: 394,
  },
};

export const TwoChips: Story = {
  args: {},
  decorators: () => {
    return (
      <Box display="flex" gap={2}>
        <Paper sx={{ padding: 2 }}>
          <Box alignItems="center" display="flex" gap={2}>
            <ZUIDataChip color="main" value={1240} />
            <Typography variant="headingMd">Something</Typography>
          </Box>
        </Paper>
        <Paper sx={{ padding: 2 }}>
          <Box alignItems="center" display="flex" gap={2}>
            <ZUIDataChip color="final" value={343} />
            <Typography variant="headingMd">Other thing</Typography>
          </Box>
        </Paper>
      </Box>
    );
  },
};

export const ThreeChips: Story = {
  args: {},
  decorators: () => {
    return (
      <Box display="flex" gap={2}>
        <Box alignItems="center" display="flex" gap={1}>
          <ZUIText color="secondary" variant="headingSm">
            First value
          </ZUIText>
          <ZUIDivider flexItem orientation="vertical" />
          <ZUIDataChip color="main" value={1240} />
        </Box>
        <Box alignItems="center" display="flex" gap={1}>
          <ZUIText color="secondary" variant="headingSm">
            Second value
          </ZUIText>
          <ZUIDivider flexItem orientation="vertical" />
          <ZUIDataChip color="mid2" value={387} />
        </Box>
        <Box alignItems="center" display="flex" gap={1}>
          <ZUIText color="secondary" variant="headingSm">
            Third value
          </ZUIText>
          <ZUIDivider flexItem orientation="vertical" />
          <ZUIDataChip color="final" value={343} />
        </Box>
      </Box>
    );
  },
};

export const FourChips: Story = {
  args: {},
  decorators: () => {
    return (
      <Box display="flex" flexDirection="column" gap={2} width="300px">
        <Box alignItems="center" display="flex" gap={1}>
          <ZUIDataChip color="main" value={1240} />
          <ZUIText>First</ZUIText>
        </Box>
        <Box alignItems="center" display="flex" gap={1}>
          <ZUIDataChip color="mid3" value={231} />
          <ZUIText>Second</ZUIText>
        </Box>
        <Box alignItems="center" display="flex" gap={1}>
          <ZUIDataChip color="mid1" value={34} />
          <ZUIText>Third</ZUIText>
        </Box>
        <Box alignItems="center" display="flex" gap={1}>
          <ZUIDataChip color="final" value={343} />
          <ZUIText>Fourth</ZUIText>
        </Box>
      </Box>
    );
  },
};
