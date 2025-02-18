import { Meta, StoryFn } from '@storybook/react';

import mockFile from 'utils/testing/mocks/mockFile';
import ZUIFileChip from '.';

export default {
  component: ZUIFileChip,
  title: 'Other/ZUIFileChip',
} as Meta<typeof ZUIFileChip>;

const Template: StoryFn<typeof ZUIFileChip> = (args) => (
  <ZUIFileChip
    loading={args.loading}
    name={args.name}
    onDelete={args.onDelete}
    url={args.url}
  />
);

const file = mockFile();

export const linked = Template.bind({});
linked.args = {
  mimeType: file.mime_type,
  name: file.original_name,
  url: file.url,
};

export const unlinked = Template.bind({});
unlinked.args = {
  mimeType: file.mime_type,
  name: file.original_name,
};

export const withDelete = Template.bind({});
withDelete.args = {
  name: file.original_name,
  onDelete: () => undefined,
};

export const loading = Template.bind({});
loading.args = {
  loading: true,
  name: file.original_name,
};
