import AddedTagsTracker from './AddedTagsTracker';
import mockTag from 'utils/testing/mocks/mockTag';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: AddedTagsTracker,
  title: 'Import/AddedTagsTracker',
} as ComponentMeta<typeof AddedTagsTracker>;

const Template: ComponentStory<typeof AddedTagsTracker> = (args) => (
  <AddedTagsTracker
    count={args.count}
    fieldName={args.fieldName}
    tags={args.tags}
  />
);
const tag = mockTag();
export const addedTagsTracker = Template.bind({});
addedTagsTracker.args = {
  count: 7,
  fieldName: 'Tags',
  tags: [tag, tag, tag, tag, tag, tag, tag],
};
