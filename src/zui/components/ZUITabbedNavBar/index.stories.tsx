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
        href: '/?path=/docs/components',
        label: 'Overview',
      },
      {
        href: '/?path=/docs/components-zuitabbednavbar--docs',
        label: 'Map',
      },
      {
        href: '/?path=/docs/components-zuitabview--docs',
        label: 'Assignees',
      },
    ],
  },
  render: function Render(args) {
    const [value, setValue] = useState('/?path=/docs/components');

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2' }}>
        <ZUIText>Warning: clicking will navigate</ZUIText>
        <ZUITabbedNavBar
          {...args}
          items={args.items}
          onSelectTab={(newValue) => setValue(newValue)}
          selectedTab={value}
        />
      </Box>
    );
  },
};

export const FullWidth: Story = {
  args: { ...Basic.args, fullWidth: true },
  render: Basic.render,
};
