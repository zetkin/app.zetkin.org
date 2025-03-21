import { Box, Typography } from '@mui/material';
import { Meta, StoryFn } from '@storybook/react';

import ZUIDialog from '.';

export default {
  component: ZUIDialog,
  title: 'Other/ZUIDialog',
} as Meta<typeof ZUIDialog>;

const Template: StoryFn<typeof ZUIDialog> = (args) => (
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
