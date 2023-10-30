import mockOrganization from 'utils/testing/mocks/mockOrganization';
import ZUIImportChangeTracker from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ZUIImportChangeTracker,
  title: 'Import/ZUIImportChangeTracker',
} as ComponentMeta<typeof ZUIImportChangeTracker>;

const Template: ComponentStory<typeof ZUIImportChangeTracker> = (args) => (
  <ZUIImportChangeTracker
    count={args.count}
    desc={args.desc}
    fieldName={args.fieldName}
    orgs={args.orgs}
  />
);
const org = mockOrganization();

export const firstName = Template.bind({});
firstName.args = {
  count: 7,
  desc: 'people will recieve changes to their',
  fieldName: 'First name',
};

export const lastName = Template.bind({});
lastName.args = {
  count: 43,
  desc: 'people will recieve changes to their',
  fieldName: 'Last name',
};
export const orgs = Template.bind({});
orgs.args = {
  count: 2070,
  desc: 'people will be added to an',
  fieldName: 'Organization',
  orgs: [org, org, org, org, org, org, org, org, org, org, org, org],
};
