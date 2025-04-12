import { Meta, StoryFn } from '@storybook/react';

import ZUIAccessList from '.';

export default {
  component: ZUIAccessList,
  title: 'Other/ZUIAccessList',
} as Meta<typeof ZUIAccessList>;

const Template: StoryFn<typeof ZUIAccessList> = (args) => {
  return (
    <div style={{ width: 700 }}>
      <ZUIAccessList
        accessList={args.accessList}
        officials={args.officials}
        orgId={args.orgId}
      />
    </div>
  );
};

export const basic = Template.bind({});
basic.args = {
  accessList: [
    {
      level: 'configure',
      person: {
        first_name: 'Clara',
        id: 1,
        last_name: 'Zetkin',
      },
      updated: '1857-07-05T13:37:00.000Z',
      updated_by: {
        first_name: 'Angela',
        id: 2,
        last_name: 'Davis',
      },
    },
    {
      level: 'edit',
      person: {
        first_name: 'Clara',
        id: 1,
        last_name: 'Zetkin',
      },
      updated: '1857-07-05T13:37:00.000Z',
      updated_by: {
        first_name: 'Angela',
        id: 2,
        last_name: 'Davis',
      },
    },
    {
      level: 'readonly',
      person: {
        first_name: 'Clara',
        id: 1,
        last_name: 'Zetkin',
      },
      updated: '1857-07-05T13:37:00.000Z',
      updated_by: {
        first_name: 'Angela',
        id: 2,
        last_name: 'Davis',
      },
    },
    {
      level: 'readonly',
      person: {
        first_name: 'Clara',
        id: 1,
        last_name: 'Zetkin',
      },
      updated: '1857-07-05T13:37:00.000Z',
      updated_by: {
        first_name: 'Angela',
        id: 2,
        last_name: 'Davis',
      },
    },
    {
      level: 'readonly',
      person: {
        first_name: 'Clara',
        id: 1,
        last_name: 'Zetkin',
      },
      updated: '1857-07-05T13:37:00.000Z',
      updated_by: {
        first_name: 'Angela',
        id: 2,
        last_name: 'Davis',
      },
    },
    {
      level: 'readonly',
      person: {
        first_name: 'Clara',
        id: 1,
        last_name: 'Zetkin',
      },
      updated: '1857-07-05T13:37:00.000Z',
      updated_by: {
        first_name: 'Angela',
        id: 2,
        last_name: 'Davis',
      },
    },
    {
      level: 'readonly',
      person: {
        first_name: 'Clara',
        id: 1,
        last_name: 'Zetkin',
      },
      updated: '1857-07-05T13:37:00.000Z',
      updated_by: {
        first_name: 'Angela',
        id: 2,
        last_name: 'Davis',
      },
    },
  ],
  officials: [
    {
      first_name: 'Angela',
      id: 2,
      last_name: 'Davis',
      role: 'admin',
    },
    {
      first_name: 'Angela',
      id: 2,
      last_name: 'Davis',
      role: 'organizer',
    },
  ],
  orgId: 1,
};
