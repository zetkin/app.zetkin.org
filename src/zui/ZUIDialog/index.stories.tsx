import { Box, Typography } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIDialog from '.';

export default {
  component: ZUIDialog,
  title: 'Atoms/ZUIDialog',
} as ComponentMeta<typeof ZUIDialog>;

const Template: ComponentStory<typeof ZUIDialog> = (args) => (
  <ZUIDialog
    maxWidth={args.maxWidth}
    onClose={args.onClose}
    open={args.open}
    title={args.title}
  >
    {args.children}
  </ZUIDialog>
);

const children = (
  <Box>
    <Typography>Dialog child</Typography>
  </Box>
);

export const basic = Template.bind({});
basic.args = {
  children: children,
  onClose: () => null,
  open: true,
};

export const title = Template.bind({});
title.args = {
  ...basic.args,
  title: 'Title of the best dialog in the world',
};

export const maxWidth = Template.bind({});
maxWidth.args = {
  ...basic.args,
  maxWidth: 'xl',
};
