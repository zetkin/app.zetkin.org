import { Meta, StoryObj } from '@storybook/nextjs';
import { ImportantDevices, Surfing, Visibility } from '@mui/icons-material';

import ZUITextField from './index';

const meta: Meta<typeof ZUITextField> = {
  component: ZUITextField,
  title: 'Components/ZUITextField',
};
export default meta;

type Story = StoryObj<typeof ZUITextField>;

export const Basic: Story = {
  args: {
    label: 'Name',
  },
};

export const Large: Story = {
  args: {
    ...Basic.args,
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
  },
};

export const ErrorAndHelperText: Story = {
  args: {
    ...Basic.args,
    error: true,
    helperText: 'You need to fill in this field.',
  },
};

export const StartAndEndIcons: Story = {
  args: {
    ...Basic.args,
    endIcon: Visibility,
    startIcon: ImportantDevices,
  },
};

export const LargeWithStartAndEndIcons: Story = {
  args: {
    ...Basic.args,
    endIcon: Visibility,
    size: 'large',
    startIcon: ImportantDevices,
  },
};

export const Multiline: Story = {
  args: {
    ...Basic.args,
    multiline: true,
  },
};

export const MultilineWithCustomMaxRows: Story = {
  args: {
    ...Basic.args,
    maxRows: 3,
    multiline: true,
  },
};

export const WithClickableEndIcon: Story = {
  args: {
    ...Basic.args,
    endIcon: Surfing,
    onEndIconClick: () => alert('You clicked the end icon!'),
  },
};
