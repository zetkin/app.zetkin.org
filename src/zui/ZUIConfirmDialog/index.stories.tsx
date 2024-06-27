import { Meta, StoryFn } from '@storybook/react';

import ZUIConfirmDialog from '.';

export default {
  component: ZUIConfirmDialog,
  title: 'Atoms/ZetkinConfirmDialog',
} as Meta<typeof ZUIConfirmDialog>;

const Template: StoryFn<typeof ZUIConfirmDialog> = (args) => (
  <ZUIConfirmDialog
    onCancel={args.onCancel}
    onSubmit={args.onSubmit}
    open={args.open}
    submitDisabled={args.submitDisabled}
    title={args.title}
    warningText={args.warningText}
  />
);

export const basic = Template.bind({});
basic.args = {
  onCancel: undefined,
  onSubmit: undefined,
  open: true,
};

export const submitDisabled = Template.bind({});
submitDisabled.args = {
  ...basic.args,
  submitDisabled: true,
};

export const title = Template.bind({});
title.args = {
  ...basic.args,
  title: 'This is an alternative title',
};

export const warningText = Template.bind({});
warningText.args = {
  ...basic.args,
  warningText: 'This is an alternative warning text',
};
