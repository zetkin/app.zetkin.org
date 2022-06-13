import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZetkinConfirmDialog from './ZetkinConfirmDialog';

export default {
  component: ZetkinConfirmDialog,
  title: 'Atoms/ZetkinConfirmDialog',
} as ComponentMeta<typeof ZetkinConfirmDialog>;

const Template: ComponentStory<typeof ZetkinConfirmDialog> = (args) => (
  <ZetkinConfirmDialog
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
