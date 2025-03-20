import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box } from '@mui/material';
import { Search } from '@mui/icons-material';

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
  render: function Render() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ZUIButton label="Open" onClick={() => setDrawerOpen(true)} />
        <ZUIDrawerModal
          featureName="test"
          icon={Search}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          primaryButton={{ label: 'Test', onClick: () => null }}
          secondaryButton={{ label: 'Secondary', onClick: () => null }}
          subtitle="cool cool cool"
          title="Modal title"
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
