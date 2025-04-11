import { Meta, StoryObj } from '@storybook/react';
import {
  AssignmentOutlined,
  CheckBoxOutlined,
  Event,
  Mail,
  Map,
  Phone,
  PhoneTwoTone,
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
                href: '#',
                icon: PhoneTwoTone,
                title: 'Organizer meet-up',
              },
              {
                children: [],
                href: '#1',
                icon: Phone,
                title: 'Calling all members who rent',
              },
              {
                children: [],
                href: '#2',
                icon: Event,
                title: 'Protest against rent increase',
              },
              {
                children: [],
                href: '#3',
                icon: Event,
                title: 'Meeting for local renters group',
              },
              {
                children: [],
                href: '#4',
                icon: AssignmentOutlined,
                title: 'Survey: will you join the rent strike?',
              },
              {
                children: [],
                href: '#5',
                icon: Map,
                title: 'Door knocking in local area',
              },
              {
                children: [],
                href: '#6',
                icon: Mail,
                title: 'Email to rent activists',
              },
              {
                children: [],
                href: '#7',
                icon: CheckBoxOutlined,
                title: 'Talk to 2 neighbours about rents',
              },
            ],
            href: '#8',
            title: 'Organizing against landlords',
          },
        ],
        href: '#9',
        title: 'Projects',
      },
    ],
  },
};
