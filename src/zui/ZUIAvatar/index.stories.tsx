import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIAvatar from '.';

export default {
  component: ZUIAvatar,
  title: 'Atoms/ZUIAvatar',
} as ComponentMeta<typeof ZUIAvatar>;

const Template: ComponentStory<typeof ZUIAvatar> = (args) => {
  return <ZUIAvatar orgId={args.orgId} personId={args.personId} />;
};

export const basic = Template.bind({});
basic.args = {
  orgId: 1,
  personId: 1,
};
