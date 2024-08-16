import { Meta, StoryObj } from '@storybook/react';
import { SquareFootSharp, Surfing } from '@mui/icons-material';

import ZUIBreadcrumbs from './index';

const meta: Meta<typeof ZUIBreadcrumbs> = {
  component: ZUIBreadcrumbs,
};
export default meta;

type Story = StoryObj<typeof ZUIBreadcrumbs>;

export const Basic: Story = {
  args: {
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
                icon: SquareFootSharp,
                id: 4,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test5',
                icon: Surfing,
                id: 5,
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
  },
};
