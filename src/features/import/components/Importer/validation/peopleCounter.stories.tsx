import { ComponentMeta, ComponentStory } from '@storybook/react';
import PeopleCounter, { COUNT_STATUS } from './PeopleCounter';

export default {
  component: PeopleCounter,
  title: 'Import/PeopleCounter',
} as ComponentMeta<typeof PeopleCounter>;

const Template: ComponentStory<typeof PeopleCounter> = (args) => (
  <PeopleCounter changedNum={args.changedNum} status={args.status} />
);

export const create = Template.bind({});
create.args = {
  changedNum: 341,
  status: COUNT_STATUS.CREATED,
};

export const update = Template.bind({});
update.args = {
  changedNum: 4312,
  status: COUNT_STATUS.UPDATED,
};
