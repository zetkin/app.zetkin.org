import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';

import ZUIItemCard from './index';

const meta: Meta<typeof ZUIItemCard> = {
  component: ZUIItemCard,
  title: 'Components/ZUIItemCard',
};
export default meta;

type Story = StoryObj<typeof ZUIItemCard>;

export const Basic: Story = {
  args: {
    button: { label: 'See the full program', onClick: () => null },
    description:
      '20 events across 5 venues with presenters from Denmark, Bulgaria, Greece and France.',
    subtitle: 'March 5 - March 9',
    title: 'Feminist action week',
  },
  render: function Render(args) {
    return (
      <Box width="250px">
        <ZUIItemCard {...args} />
      </Box>
    );
  },
};

export const Avatar: Story = {
  args: {
    avatar: { firstName: 'Angela', id: 1, lastName: 'Davis' },
    description:
      'Angela has been a caller in 5 call assignments, attended 14 events and participated in 3 area assignments.',
    subtitle: 'Activist',
    title: 'Angela Davis',
  },
  render: Basic.render,
};

export const Image: Story = {
  args: {
    button: { label: 'Configure', onClick: () => null },
    image: <Box sx={{ backgroundColor: 'peachpuff', height: '100%' }} />,
    subtitle: 'Find people based on the surveys they responded to',
    title: 'Survey responses',
  },
  render: Basic.render,
};
