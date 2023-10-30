import mockTag from 'utils/testing/mocks/mockTag';
import ZUIAddedTagsIndicator from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ZUIAddedTagsIndicator,
  title: 'Import/ZUIAddedTagsIndicator',
} as ComponentMeta<typeof ZUIAddedTagsIndicator>;

const Template: ComponentStory<typeof ZUIAddedTagsIndicator> = (args) => (
  <ZUIAddedTagsIndicator
    count={args.count}
    desc={args.desc}
    fieldName={args.fieldName}
    tags={args.tags}
  />
);
const tag = mockTag();
export const addedTagsIndicator = Template.bind({});
addedTagsIndicator.args = {
  count: 7,
  desc: 'people will have',
  fieldName: 'Tags',
  tags: [tag, tag, tag, tag, tag, tag, tag],
};
