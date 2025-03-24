import { Meta, StoryObj } from '@storybook/react';
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
  args: {},
  render: function Render(args) {
    const [value, setValue] = useState('share');

    return (
      <ZUITabView
        {...args}
        items={[
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
        ]}
        onChange={(newValue) => setValue(newValue)}
        value={value}
      />
    );
  },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: Basic.render,
};
