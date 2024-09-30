import { Meta, StoryObj } from '@storybook/react';

import ZUIBarDiagram from './index';

const meta: Meta<typeof ZUIBarDiagram> = {
  component: ZUIBarDiagram,
};
export default meta;

type Story = StoryObj<typeof ZUIBarDiagram>;

export const Primary: Story = {
  args: {
    size: 'medium',
    values: [25],
  },
};

export const ThreeSegments: Story = {
  args: {
    size: 'medium',
    values: [25, 25],
  },
};

export const FourSegments: Story = {
  args: {
    size: 'medium',
    values: [33, 33, 10],
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'extraSmall',
    values: [33, 33, 10],
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    values: [33, 33, 10],
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    values: [33, 33, 10],
  },
};
