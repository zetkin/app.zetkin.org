import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIPersonAvatar from '.';

export default {
  component: ZUIPersonAvatar,
  title: 'Atoms/ZUIPersonAvatar',
} as ComponentMeta<typeof ZUIPersonAvatar>;

const Template: ComponentStory<typeof ZUIPersonAvatar> = (args) => {
  return <ZUIPersonAvatar orgId={args.orgId} personId={args.personId} />;
};

export const basic = Template.bind({});
basic.args = {
  orgId: 1,
  personId: 1,
};
