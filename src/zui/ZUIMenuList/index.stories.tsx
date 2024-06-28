import { Meta, StoryObj } from '@storybook/react';

import ZUIMenuItem from '../ZUIMenuItem';
import ZUIMenuList from './index';

const meta: Meta<typeof ZUIMenuList> = {
  component: ZUIMenuList,
};
export default meta;

type Story = StoryObj<typeof ZUIMenuList>;

export const Basic: Story = {
  args: {
    children: (
      <>
        <ZUIMenuItem label="Mobilize" />
        <ZUIMenuItem label="Strategize" />
        <ZUIMenuItem label="Organize" />
      </>
    ),
  },
};

export const Dense: Story = {
  args: {
    children: (
      <>
        <ZUIMenuItem label="Mobilize" />
        <ZUIMenuItem label="Strategize" />
        <ZUIMenuItem label="Organize" />
      </>
    ),
    dense: true,
  },
};

export const NoGutters: Story = {
  args: {
    children: (
      <>
        <ZUIMenuItem label="Mobilize" />
        <ZUIMenuItem label="Strategize" />
        <ZUIMenuItem label="Organize" />
      </>
    ),
    disableGutters: true,
  },
};

export const SmallScreen: Story = {
  args: {
    children: (
      <>
        <ZUIMenuItem label="Mobilize" />
        <ZUIMenuItem label="Strategize" />
        <ZUIMenuItem label="Organize" />
      </>
    ),
    smallScreen: true,
  },
};
