import { ComponentMeta, ComponentStory } from '@storybook/react';
import PeopleCounter, { COUNT_STATUS } from './PeopleCounter';

export default {
  component: PeopleCounter,
  title: 'Import/PeopleCounter',
} as ComponentMeta<typeof PeopleCounter>;

const Template: ComponentStory<typeof PeopleCounter> = (args) => (
  <PeopleCounter count={args.count} status={args.status} />
);

export const create = Template.bind({});
create.args = {
  count: 341,
  status: COUNT_STATUS.CREATED,
};

export const update = Template.bind({});
update.args = {
  count: 4312,
  status: COUNT_STATUS.UPDATED,
};
