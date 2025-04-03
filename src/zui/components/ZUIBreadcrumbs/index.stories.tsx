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
  title: 'Components/ZUIBreadcrumbs',
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
                title: 'My event',
              },
              {
                children: [],
                href: 'test4',
                icon: SquareFootSharp,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test5',
                icon: Surfing,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test6',
                icon: HomeRepairService,
                title: 'Another event',
              },
              {
                children: [],
                href: 'test7',
                icon: SquareFootSharp,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test8',
                icon: Surfing,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test9',
                icon: SportsBar,
                title: 'My party',
              },
              {
                children: [],
                href: 'test10',
                icon: SquareFootSharp,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test11',
                icon: Surfing,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test12',
                icon: PartyMode,
                title: 'Birthday',
              },
              {
                children: [],
                href: 'test13',
                icon: SquareFootSharp,
                title: 'My other event',
              },
              {
                children: [],
                href: 'test14',
                icon: Surfing,
                title: 'My other event',
              },
            ],
            href: 'test2',
            title: 'My project',
          },
        ],
        href: 'test1',
        title: 'Projects',
      },
    ],
  },
};
