import { Meta, StoryObj } from '@storybook/react';

import ZUIPersonAvatarGroup from './index';

const meta: Meta<typeof ZUIPersonAvatarGroup> = {
  component: ZUIPersonAvatarGroup,
  title: 'Components/ZUIAvatarGroup',
};
export default meta;

type Story = StoryObj<typeof ZUIPersonAvatarGroup>;

export const PersonAvatars: Story = {
  args: {
    avatars: [
      { firstName: 'Angela', id: 1, lastName: 'Davis' },
      { firstName: 'Assata', id: 2, lastName: 'Shakur' },
      { firstName: 'Maya', id: 3, lastName: 'Angelou' },
      { firstName: 'Toni', id: 4, lastName: 'Morrison' },
      { firstName: 'Alice', id: 5, lastName: 'Walker' },
    ],
  },
};

export const OrgAvatars: Story = {
  args: {
    avatars: [
      { orgId: 1, title: 'My Organization' },
      { orgId: 3, title: 'Freedom Party' },
      { orgId: 45, title: 'Union of workers' },
      { orgId: 2, title: 'Environmenters' },
      { orgId: 12, title: 'Superorganisers' },
    ],
  },
};

export const MaxPersonAvatars: Story = {
  args: {
    ...PersonAvatars.args,
    max: 4,
  },
};

export const MaxOrgAvatars: Story = {
  args: {
    ...OrgAvatars.args,
    max: 4,
  },
};

export const SmallPersonAvatars: Story = {
  args: {
    ...PersonAvatars.args,
    max: 4,
    size: 'small',
  },
};

export const SmallOrgAvatars: Story = {
  args: {
    ...OrgAvatars.args,
    max: 4,
    size: 'small',
  },
};

export const LargeOrgAvatars: Story = {
  args: {
    ...OrgAvatars.args,
    max: 3,
    size: 'large',
  },
};

export const LargePersonAvatars: Story = {
  args: {
    ...PersonAvatars.args,
    max: 3,
    size: 'large',
  },
};
