import ZUIPeopleCounter from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ZUIPeopleCounter,
  title: 'Import/ZUIPeopleCounter',
} as ComponentMeta<typeof ZUIPeopleCounter>;
export enum COUNT_STATUS {
  CREATED = 'created',
  UPDATED = 'updated',
}

const Template: ComponentStory<typeof ZUIPeopleCounter> = (args) => (
  <ZUIPeopleCounter count={args.count} desc={args.desc} status={args.status} />
);

export const create = Template.bind({});
create.args = {
  count: 341,
  desc: 'new people will be created',
  status: COUNT_STATUS.CREATED,
};

export const update = Template.bind({});
update.args = {
  count: 4312,
  desc: 'people will be updated',
  status: COUNT_STATUS.UPDATED,
};
