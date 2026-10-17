import { Meta, StoryFn } from '@storybook/nextjs';

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
      granted: '1857-07-05T13:37:00.000Z',
      granted_by_user_id: 2,
      id: 1,
      level: 'configure',
      user_id: 1,
    },
    {
      granted: '1857-07-05T13:37:00.000Z',
      granted_by_user_id: 2,
      id: 2,
      level: 'edit',
      user_id: 1,
    },
    {
      granted: '1857-07-05T13:37:00.000Z',
      granted_by_user_id: null,
      id: 3,
      level: 'readonly',
      user_id: 1,
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
