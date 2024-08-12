import { Meta, StoryFn } from '@storybook/react';

import ZUIDateTime from '.';

export default {
  component: ZUIDateTime,
  title: 'Atoms/ZUIDateTime',
} as Meta<typeof ZUIDateTime>;

const Template: StoryFn<typeof ZUIDateTime> = (args) => (
  <ZUIDateTime convertToLocal={args.convertToLocal} datetime={args.datetime} />
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
