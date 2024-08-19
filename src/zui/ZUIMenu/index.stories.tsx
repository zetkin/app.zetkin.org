import { Surfing } from '@mui/icons-material';
import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import ZUIButton from 'zui/ZUIButton';
import ZUIMenu from './index';

const meta: Meta<typeof ZUIMenu> = {
  component: ZUIMenu,
};
export default meta;

type Story = StoryObj<typeof ZUIMenu>;

export const Basic: Story = {
  args: {
    menuItems: [
      {
        endContent: '#B',
        label: 'Call assignment',
        onClick: () => null,
      },
      { label: 'Survey', onClick: () => null, startIcon: <Surfing /> },
      { label: 'Task', onClick: () => null },
      { label: 'Journey', onClick: () => null },
      { divider: true, label: 'Event', onClick: () => null },
      { disabled: true, label: 'Email', onClick: () => null },
    ],
  },
  render: function Render(args) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    return (
      <>
        <ZUIButton
          label="Click to open menu"
          onClick={(ev) => setAnchorEl(anchorEl ? null : ev.currentTarget)}
          type="primary"
        />
        <ZUIMenu
          {...args}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
        />
      </>
    );
  },
};

export const Dense: Story = {
  args: {
    ...Basic.args,
    dense: true,
  },
  render: Basic.render,
};

export const GuttersDisabled: Story = {
  args: {
    ...Basic.args,
    disableGutters: true,
  },
  render: Basic.render,
};

export const MaxHeight: Story = {
  args: {
    ...Basic.args,
    maxHeight: '50px',
  },
  render: Basic.render,
};

export const MinWidth: Story = {
  args: {
    ...Basic.args,
    width: '200px',
  },
  render: Basic.render,
};
