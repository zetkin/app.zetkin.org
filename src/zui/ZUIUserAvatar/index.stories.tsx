import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIUserAvatar from '.';

export default {
  component: ZUIUserAvatar,
  title: 'Atoms/ZUIUserAvatar',
} as ComponentMeta<typeof ZUIUserAvatar>;

const Template: ComponentStory<typeof ZUIUserAvatar> = (args) => {
  return <ZUIUserAvatar personId={args.personId} />;
};

export const basic = Template.bind({});
basic.args = {
  personId: 1,
};
