import { Box, Button } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIReorderable from '.';

export default {
  component: ZUIReorderable,
  title: 'Atoms/ZUIReorderable',
} as ComponentMeta<typeof ZUIReorderable>;

interface itemRef {
  stepInput: HTMLInputElement;
}

const Template: ComponentStory<typeof ZUIReorderable> = (args) => (
  <div style={{ width: 400 }}>
    <ZUIReorderable
      disabled={args.disabled}
      onReordering={args.onReordering}
      onReorder={args.onReorder}
    >
      {args.children}
    </ZUIReorderable>
  </div>
);

export const noAction = Template.bind({});
export const basic = Template.bind({});
basic.args = {
  disabled: false,
  onReorder: false,
  onReordering() {
    console.log('I´m reordering');
  },
};
