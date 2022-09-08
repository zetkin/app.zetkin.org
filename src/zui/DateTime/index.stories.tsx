import { ComponentMeta, ComponentStory } from '@storybook/react';

import DateTime from '.';

export default {
  component: DateTime,
  title: 'Atoms/DateTime',
} as ComponentMeta<typeof DateTime>;

const Template: ComponentStory<typeof DateTime> = (args) => (
  <DateTime convertToLocal={args.convertToLocal} datetime={args.datetime} />
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
