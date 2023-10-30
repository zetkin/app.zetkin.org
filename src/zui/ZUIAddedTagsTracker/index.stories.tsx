import mockTag from 'utils/testing/mocks/mockTag';
import ZUIAddedTagsTracker from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ZUIAddedTagsTracker,
  title: 'Import/ZUIAddedTagsTracker',
} as ComponentMeta<typeof ZUIAddedTagsTracker>;

const Template: ComponentStory<typeof ZUIAddedTagsTracker> = (args) => (
  <ZUIAddedTagsTracker
    count={args.count}
    desc={args.desc}
    fieldName={args.fieldName}
    tags={args.tags}
  />
);
const tag = mockTag();
export const addedTagsTracker = Template.bind({});
addedTagsTracker.args = {
  count: 7,
  desc: 'people will have',
  fieldName: 'Tags',
  tags: [tag, tag, tag, tag, tag, tag, tag],
};
