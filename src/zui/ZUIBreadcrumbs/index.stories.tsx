import { Meta, StoryObj } from '@storybook/react';

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
                parent: {
                  href: 'test2',
                  id: 2,
                  title: 'Events',
                },
                title: 'My event',
              },
              {
                children: [],
                href: 'test4',
                id: 4,
                parent: {
                  href: 'test2',
                  id: 2,
                  title: 'Events',
                },
                title: 'My other event',
              },
            ],
            href: 'test2',
            id: 2,
            parent: {
              href: 'test1',
              id: 1,
              title: 'Projects',
            },
            title: 'Events',
          },
        ],
        href: 'test1',
        id: 1,
        parent: null,
        title: 'Projects',
      },
    ],
  },
};
