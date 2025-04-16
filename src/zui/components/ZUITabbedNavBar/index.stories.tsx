import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box } from '@mui/material';

import ZUITabbedNavBar from './index';
import ZUIText from '../ZUIText';

const meta: Meta<typeof ZUITabbedNavBar> = {
  component: ZUITabbedNavBar,
  title: 'Components/ZUITabbedNavBar',
};
export default meta;

type Story = StoryObj<typeof ZUITabbedNavBar>;

export const Basic: Story = {
  args: {
    items: [
      {
        href: '/#',
        label: 'Overview',
        value: 'overview',
      },
      {
        href: '/#',
        label: 'Map',
        value: 'map',
      },
      {
        href: '/#',
        label: 'Assignees',
        value: 'assignees',
      },
    ],
  },
  render: function Render(args) {
    const [value] = useState('overview');

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2' }}>
        <ZUIText>Warning: clicking will navigate</ZUIText>
        <ZUITabbedNavBar {...args} items={args.items} selectedTab={value} />
      </Box>
    );
  },
};

export const FullWidth: Story = {
  args: { ...Basic.args, fullWidth: true },
  render: Basic.render,
};

export const WithBadge: Story = {
  args: {
    items: [
      {
        badge: { color: 'danger' },
        href: '#',
        label: 'Overview',
        value: 'overview',
      },
      {
        badge: { color: 'warning', number: 13 },
        href: '#',
        label: 'Map',
        value: 'map',
      },
      {
        badge: {
          color: 'info',
          number: 99999999999,
          truncateLargeNumber: true,
        },
        href: '/#',
        label: 'Assignees',
        value: 'assignees',
      },
    ],
  },
  render: Basic.render,
};
