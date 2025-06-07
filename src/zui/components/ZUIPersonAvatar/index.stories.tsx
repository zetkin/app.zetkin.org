import { useState } from 'react';
import { Box } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import ZUIPersonAvatar from './index';
import ZUIButton from '../ZUIButton';

const meta: Meta<typeof ZUIPersonAvatar> = {
  component: ZUIPersonAvatar,
  title: 'Components/ZUIPersonAvatar',
};

export default meta;
type Story = StoryObj<typeof ZUIPersonAvatar>;

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
          <ZUIPersonAvatar firstName="Angela" id={ids[0]} lastName="Davis" />
          <ZUIPersonAvatar firstName="Huey" id={ids[1]} lastName="Newton" />
          <ZUIPersonAvatar firstName="Toni" id={ids[2]} lastName="Morrisson" />
          <ZUIPersonAvatar firstName="Bobby" id={ids[3]} lastName="Seale" />
          <ZUIPersonAvatar firstName="Maya" id={ids[4]} lastName="Angelou" />
          <ZUIPersonAvatar firstName="Assata" id={ids[5]} lastName="Shakur" />
          <ZUIPersonAvatar firstName="Alice" id={ids[6]} lastName="Walker" />
        </Box>
        <ZUIButton
          label="Update id:s to change colors"
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

/**
 * This is to make it possible to distinguish that you
 * are representing the user, rather than the person.
 */
export const User: Story = {
  args: {
    ...Medium.args,
    isUser: true,
  },
};
