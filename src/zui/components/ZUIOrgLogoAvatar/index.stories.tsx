import { Meta, StoryObj } from '@storybook/react';

import ZUIOrgLogoAvatar from './index';

const meta: Meta<typeof ZUIOrgLogoAvatar> = {
  component: ZUIOrgLogoAvatar,
  title: 'Components/ZUIOrgLogoAvatar',
};
export default meta;

type Story = StoryObj<typeof ZUIOrgLogoAvatar>;

export const Medium: Story = {
  args: {
    orgId: 1,
    urlBase: 'https://app.dev.zetkin.org/api',
  },
};

export const Small: Story = {
  args: {
    ...Medium.args,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    ...Medium.args,
    size: 'lg',
  },
};
