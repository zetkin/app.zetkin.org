import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box } from '@mui/material';
import { People, Search, Surfing } from '@mui/icons-material';

import ZUIDrawerModal from './index';
import ZUIText from '../ZUIText';
import ZUIButton from '../ZUIButton';

const meta: Meta<typeof ZUIDrawerModal> = {
  component: ZUIDrawerModal,
  title: 'Components/ZUIDrawerModal',
};
export default meta;

type Story = StoryObj<typeof ZUIDrawerModal>;

export const Basic: Story = {
  args: {
    featureName: 'test',
    icon: Surfing,
    primaryButton: { label: 'Go surfing!', onClick: () => null },
    secondaryButton: { label: 'Start over', onClick: () => null },
    subtitle: 'Hang loose man',
    title: 'Surf the waves',
  },
  render: function Render(args) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ZUIButton label="Open" onClick={() => setDrawerOpen(true)} />
        <ZUIDrawerModal
          {...args}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'peachpuff',
              display: 'flex',
              height: '1000px',
              justifyContent: 'center',
              padding: '1rem',
              width: '100%',
            }}
          >
            <ZUIText>Children here</ZUIText>
          </Box>
        </ZUIDrawerModal>
      </Box>
    );
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    breadcrumbs: ['Overview', 'Select filter', 'Filter settings'],
    featureName: 'Smart search',
    icon: Search,
    primaryButton: { label: 'Start over', onClick: () => null },
    secondaryButton: { label: 'Close', onClick: () => null },
    title: 'Smart search',
  },
  render: Basic.render,
};

export const NoButtonsInHeader: Story = {
  args: {
    breadcrumbs: ['Upload file', 'Configure', 'Verify'],
    featureName: 'Import',
    icon: People,
    title: 'Import',
  },
  render: Basic.render,
};
