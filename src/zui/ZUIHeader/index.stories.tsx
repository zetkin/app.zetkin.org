import { Box } from '@mui/material';
import { CatchingPokemon, Surfing } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import RightSide from './index';
import ZUIMenuList from 'zui/ZUIMenuList';
import ZUIButton from 'zui/ZUIButton';

const meta: Meta<typeof RightSide> = {
  component: RightSide,
};
export default meta;

type Story = StoryObj<typeof RightSide>;

export const EditableTitle: Story = {
  args: {
    actionButtonLabel: 'Publish',
    actionButtonType: 'primary',
    avatar:
      'https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg',
    belowActionButton: (
      <Box bgcolor="lightcoral" padding={1}>
        You can put a thing here below the action button
      </Box>
    ),
    belowTitle: (
      <Box bgcolor="lightblue" padding={1}>
        You can put a thing here below the title
      </Box>
    ),
    breadcrumbs: [
      {
        children: [
          {
            children: [
              {
                children: [],
                href: 'test3',
                id: 3,
                title: 'My event',
              },
              {
                children: [],
                href: 'test4',
                id: 4,
                title: 'My other event',
              },
            ],
            href: 'test2',
            id: 2,
            title: 'Events',
          },
        ],
        href: 'test1',
        id: 1,
        title: 'Projects',
      },
    ],
    metaData: [
      {
        icon: CatchingPokemon,
        label: 'Pokemon',
      },
      {
        icon: Surfing,
        label: 'Surf dude',
      },
    ],
    onActionButtonClick: () => null,
    onTitleChange: (newValue) => {
      newValue;
    },
    title: 'Page title',
  },
};

export const StaticTitle: Story = {
  args: {
    actionButtonLabel: 'Publish',
    avatar:
      'https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg',
    belowActionButton: (
      <Box bgcolor="lightcoral" padding={1}>
        You can put a thing here below the action button
      </Box>
    ),
    belowTitle: (
      <Box bgcolor="lightblue" padding={1}>
        You can put a thing here below the title
      </Box>
    ),
    breadcrumbs: [
      {
        children: [
          {
            children: [
              {
                children: [],
                href: 'test3',
                id: 3,
                title: 'My event',
              },
              {
                children: [],
                href: 'test4',
                id: 4,
                title: 'My other event',
              },
            ],
            href: 'test2',
            id: 2,
            title: 'Events',
          },
        ],
        href: 'test1',
        id: 1,
        title: 'Projects',
      },
    ],
    metaData: [
      {
        icon: CatchingPokemon,
        label: 'Pokemon',
      },
      {
        icon: Surfing,
        label: 'Surf dude',
      },
    ],
    onActionButtonClick: () => null,
    title: 'Page title',
  },
};

export const PrimaryActionWithPopoverAndBelowActionButton: Story = {
  args: {
    actionButtonLabel: 'Create',
    actionButtonPopoverContent: (onClose) => (
      <ZUIMenuList
        menuItems={[
          { label: 'Event', onClick: onClose },
          { label: 'Email', onClick: onClose },
        ]}
      />
    ),
    belowActionButton: (
      <Box border={1} padding={1}>
        You can put a thing here below the action button
      </Box>
    ),
  },
};

export const PrimaryActionWithEllipsisMenu: Story = {
  args: {
    actionButtonLabel: 'Unpublish',
    ellipsisMenuItems: [
      { label: 'Rename', onClick: () => null },
      { label: 'Share', onClick: () => null },
    ],
    onActionButtonClick: () => null,
  },
};

export const PrimaryActionWithPopoverAndEllipsisMenu: Story = {
  args: {
    actionButtonLabel: 'Create',
    actionButtonPopoverContent: (onClose) => (
      <Box display="flex" flexDirection="column" padding={2}>
        <Box paddingY={2}>
          Hello! This is just a random component with whatever content you want
        </Box>
        <Box alignSelf="flex-end">
          <ZUIButton label="Close me" onClick={onClose} type="primary" />
        </Box>
      </Box>
    ),
    ellipsisMenuItems: [
      { label: 'Rename', onClick: () => null },
      { label: 'Share', onClick: () => null },
    ],
  },
};
