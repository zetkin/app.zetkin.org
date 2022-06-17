import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZetkinDateTime from './ZetkinDateTime';

export default {
  component: ZetkinDateTime,
  title: 'Atoms/ZetkinDateTime',
} as ComponentMeta<typeof ZetkinDateTime>;

const Template: ComponentStory<typeof ZetkinDateTime> = (args) => (
  <ZetkinDateTime
    convertToLocal={args.convertToLocal}
    datetime={args.datetime}
  />
);

// slicing away the "Z" at the end of the ISO-string, because
// that's how dates are formatted coming from the backend.
export const basic = Template.bind({});
basic.args = {
  datetime: new Date().toISOString().slice(0, -1),
};

export const convertToLocal = Template.bind({});
convertToLocal.args = {
  convertToLocal: true,
  datetime: new Date().toISOString().slice(0, -1),
};
