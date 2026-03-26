import { Meta, StoryObj } from '@storybook/nextjs';
import { Circle } from '@mui/icons-material';

import ZUITargetGroupChip from './index';

const meta: Meta<typeof ZUITargetGroupChip> = {
  component: ZUITargetGroupChip,
  title: 'Components/ZUITargetGroupChip',
};
export default meta;

type Story = StoryObj<typeof ZUITargetGroupChip>;

export const Basic: Story = {
  args: {
    icon: Circle,
    label: 'All',
  },
};
