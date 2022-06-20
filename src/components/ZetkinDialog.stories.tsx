import { Box, Typography } from '@material-ui/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZetkinDialog from './ZetkinDialog';

export default {
  component: ZetkinDialog,
  title: 'Atoms/ZetkinDialog',
} as ComponentMeta<typeof ZetkinDialog>;

const Template: ComponentStory<typeof ZetkinDialog> = (args) => (
  <ZetkinDialog
    maxWidth={args.maxWidth}
    onClose={args.onClose}
    open={args.open}
    title={args.title}
  >
    {args.children}
  </ZetkinDialog>
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
