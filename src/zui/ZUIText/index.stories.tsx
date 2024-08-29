import { Meta, StoryObj } from '@storybook/react';

import ZUIText from './index';

const meta: Meta<typeof ZUIText> = {
  component: ZUIText,
};
export default meta;

type Story = StoryObj<typeof ZUIText>;

export const HeadingLarge: Story = {
  args: {
    children: 'This is a large heading',
    variant: 'headingLg',
  },
};

export const HeadingMedium: Story = {
  args: {
    children: 'This is a medium heading',
    variant: 'headingMd',
  },
};

export const HeadingSmall: Story = {
  args: {
    children: 'This is a small heading',
    variant: 'headingSm',
  },
};

export const BodyMediumRegular: Story = {
  args: {
    children: 'This is a medium size, regular weight body text',
    variant: 'bodyMdRegular',
  },
};

export const BodyMediumBold: Story = {
  args: {
    children: 'This is a medium size, bold weight body text',
    variant: 'bodyMdSemiBold',
  },
};

export const BodySmallRegular: Story = {
  args: {
    children: 'This is a small size, regular weight body text',
    variant: 'bodySmRegular',
  },
};

export const BodySmallBold: Story = {
  args: {
    children: 'This is a small size, bold weight body text',
    variant: 'bodySmSemiBold',
  },
};

export const LabelMdMedium: Story = {
  args: {
    children: 'This is a medium size, medium weight label text',
    variant: 'labelMdMedium',
  },
};

export const LabelMdRegular: Story = {
  args: {
    children: 'This is a medium size, regular weight label text',
    variant: 'labelMdRegular',
  },
};

export const LinkMd: Story = {
  args: {
    children: 'This is a medium size link text',
    variant: 'linkMd',
  },
};

export const LinkSm: Story = {
  args: {
    children: 'This is a small size link text',
    variant: 'linkSm',
  },
};
