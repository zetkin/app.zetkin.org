import { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Box } from '@mui/material';

import ZUITabView from './index';
import ZUIText from '../ZUIText';

const meta: Meta<typeof ZUITabView> = {
  component: ZUITabView,
  title: 'Components/ZUITabView',
};
export default meta;

type Story = StoryObj<typeof ZUITabView>;

export const Basic: Story = {
  args: {
    items: [
      {
        label: 'Share',
        render: () => (
          <Box sx={{ backgroundColor: 'peachpuff', height: '200px' }}>
            <ZUIText>This is the rendered content of the first tab</ZUIText>
          </Box>
        ),
        value: 'share',
      },
      {
        label: 'Export',
        render: () => (
          <Box sx={{ backgroundColor: 'lightblue', height: '200px' }}>
            <ZUIText>This is the rendered content of the other tab</ZUIText>
          </Box>
        ),
        value: 'export',
      },
    ],
  },
  render: function Render(args) {
    const [value, setValue] = useState('share');

    return (
      <ZUITabView
        {...args}
        onSelectTab={(newValue) => setValue(newValue)}
        selectedTab={value}
      />
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
        label: 'Share',
        render: () => (
          <Box sx={{ backgroundColor: 'peachpuff', height: '200px' }}>
            <ZUIText>This is the rendered content of the first tab</ZUIText>
          </Box>
        ),
        value: 'share',
      },
      {
        badge: { color: 'warning', number: 13 },
        label: 'Export',
        render: () => (
          <Box sx={{ backgroundColor: 'lightgreen', height: '200px' }}>
            <ZUIText>This is the rendered content of the second tab</ZUIText>
          </Box>
        ),
        value: 'export',
      },
      {
        badge: {
          color: 'info',
          number: 99999999999,
          truncateLargeNumber: true,
        },
        label: 'Assignees',
        render: () => (
          <Box sx={{ backgroundColor: 'lightsteelblue', height: '200px' }}>
            <ZUIText>This is the rendered content of the third tab</ZUIText>
          </Box>
        ),
        value: 'assignees',
      },
    ],
  },
  render: Basic.render,
};
