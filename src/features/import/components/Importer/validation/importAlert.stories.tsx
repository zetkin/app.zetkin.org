import { ComponentMeta, ComponentStory } from '@storybook/react';
import ImportAlert, { ALERT_STATUS } from './importAlert';

export default {
  component: ImportAlert,
  title: 'Import/ImportAlert',
} as ComponentMeta<typeof ImportAlert>;

const Template: ComponentStory<typeof ImportAlert> = (args) => (
  <ImportAlert
    bullets={args.bullets}
    msg={args.msg}
    onClickBack={args.onClickBack}
    onClickCheckbox={args.onClickCheckbox}
    status={args.status}
    title={args.title}
  />
);

export const warning = Template.bind({});
warning.args = {
  msg: 'Warning!!',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClickCheckbox: () => {},
  status: ALERT_STATUS.WARNING,
  title: 'This is warning',
};

export const info = Template.bind({});
info.args = {
  msg: 'Info!!',
  status: ALERT_STATUS.INFO,
  title: 'This is info',
};
export const error = Template.bind({});
error.args = {
  bullets: ['option 1', 'option 2'],
  msg: 'Error!!',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClickBack: () => {},
  status: ALERT_STATUS.ERROR,
  title: 'This is error',
};
export const success = Template.bind({});
success.args = {
  msg: 'Success!!',
  status: ALERT_STATUS.SUCCESS,
  title: 'This is success',
};
