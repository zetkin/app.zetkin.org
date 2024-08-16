import { Meta, StoryObj } from '@storybook/react';
import {
  HomeRepairService,
  PartyMode,
  SportsBar,
  SquareFootSharp,
  Surfing,
} from '@mui/icons-material';

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
              {
                children: [],
                href: 'test6',
                icon: HomeRepairService,
                id: 6,
                title: 'Another event',
              },
              {
                children: [],
                href: 'test7',
                icon: SquareFootSharp,
                id: 7,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test8',
                icon: Surfing,
                id: 8,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test9',
                icon: SportsBar,
                id: 9,
                title: 'My party',
              },
              {
                children: [],
                href: 'test10',
                icon: SquareFootSharp,
                id: 10,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test11',
                icon: Surfing,
                id: 11,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test12',
                icon: PartyMode,
                id: 12,
                title: 'Birthday',
              },
              {
                children: [],
                href: 'test13',
                icon: SquareFootSharp,
                id: 13,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test14',
                icon: Surfing,
                id: 14,
                title: 'My other event',
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
  },
};
