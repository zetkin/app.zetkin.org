import { Box } from '@mui/material';
import {
  Celebration,
  Edit,
  Email,
  HeadsetMicOutlined,
  People,
  Share,
} from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import RightSide from './index';
import ZUIButton from 'zui/ZUIButton';

const meta: Meta<typeof RightSide> = {
  component: RightSide,
};
export default meta;

type Story = StoryObj<typeof RightSide>;

export const PersonPageHeader: Story = {
  args: {
    avatar:
      'https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg',
    breadcrumbs: [
      {
        children: [
          {
            children: [],
            href: 'test2',
            id: 2,
            title: 'Angela Davis',
          },
        ],
        href: 'test1',
        id: 1,
        title: 'People',
      },
    ],
    title: 'Angela Davis',
  },
};

export const ProjectActivityHeader: Story = {
  args: {
    actionButtonLabel: 'Publication',
    belowActionButton: (
      <Box bgcolor="lightcoral" padding={1}>
        Component with scheduling and status info here
      </Box>
    ),
    belowTitle: (
      <Box bgcolor="lightblue" padding={1}>
        Interactive component here
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
                title: 'My call assignmemnt',
              },
              {
                children: [],
                href: 'test4',
                id: 4,
                title: 'My other call assignment',
              },
            ],
            href: 'test2',
            id: 2,
            title: 'My project',
          },
        ],
        href: 'test1',
        id: 1,
        title: 'Projects',
      },
    ],
    metaData: [
      {
        icon: People,
        label: '3668 targets',
      },
      {
        icon: HeadsetMicOutlined,
        label: '12 callers',
      },
    ],
    onTitleChange: () => null,
    title: 'My call assignment',
  },
};

export const FeaturePageHeader: Story = {
  args: {
    actionButtonLabel: 'Create',
    actionButtonType: 'primary',
    onActionButtonClick: () => null,
    title: 'Tags',
  },
};

/**
 * If you want the action button to open a menu, send in menu items instead of a component.
 * <br>
 *  Start icons are required in both action button menu items and ellipsis menu items.
 */
export const ActionButtonWithMenuAndEllipsisMenu: Story = {
  args: {
    actionButtonLabel: 'Create an activity',
    actionButtonPopoverContent: [
      { label: 'Event', onClick: () => null, startIcon: <Celebration /> },
      { label: 'Email', onClick: () => null, startIcon: <Email /> },
    ],
    ellipsisMenuItems: [
      { label: 'Rename', onClick: () => null, startIcon: <Edit /> },
      { label: 'Share', onClick: () => null, startIcon: <Share /> },
    ],
  },
};

/**
 * Instead of sending in menu items, you can send in a component to be displayed inside the action button popover
 */
export const ActionWithPopoverContentAndEllipsisMenu: Story = {
  args: {
    actionButtonLabel: 'Schedule',
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
      { label: 'Rename', onClick: () => null, startIcon: <Edit /> },
      { label: 'Share', onClick: () => null, startIcon: <Share /> },
    ],
  },
};
