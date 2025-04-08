import { useState } from 'react';
import { Box } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import ZUIAvatar from './index';
import ZUIButton from '../ZUIButton';

const meta: Meta<typeof ZUIAvatar> = {
  component: ZUIAvatar,
  title: 'Components/ZUIAvatar',
};

export default meta;
type Story = StoryObj<typeof ZUIAvatar>;

export const Multiple: Story = {
  args: {
    firstName: 'Angela',
    id: 1,
    lastName: 'Davis',
  },
  render: function Render() {
    const [ids, setIds] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <ZUIAvatar firstName="Angela" id={ids[0]} lastName="Davis" />
          <ZUIAvatar firstName="Huey" id={ids[1]} lastName="Newton" />
          <ZUIAvatar firstName="Toni" id={ids[2]} lastName="Morrisson" />
          <ZUIAvatar firstName="Bobby" id={ids[3]} lastName="Seale" />
          <ZUIAvatar firstName="Maya" id={ids[4]} lastName="Angelou" />
          <ZUIAvatar firstName="Assata" id={ids[5]} lastName="Shakur" />
          <ZUIAvatar firstName="Alice" id={ids[6]} lastName="Walker" />
        </Box>
        <ZUIButton
          label="Change avatar colours"
          onClick={() => {
            setIds(ids.map((id) => (id += ids.length)));
          }}
          variant="secondary"
        />
      </Box>
    );
  },
};

export const Medium: Story = {
  args: {
    firstName: 'Angela',
    id: 1,
    lastName: 'Davis',
  },
};

export const Small: Story = {
  args: {
    ...Medium.args,
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    ...Medium.args,
    size: 'large',
  },
};

export const Square: Story = {
  args: {
    ...Medium.args,
    variant: 'square',
  },
};
