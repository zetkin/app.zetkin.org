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
    fieldName={args.fieldName}
    orgs={args.orgs}
  />
);
const org = mockOrganization();

export const firstName = Template.bind({});
firstName.args = {
  count: 7,
  fieldName: 'First name',
};

export const lastName = Template.bind({});
lastName.args = {
  count: 43,
  fieldName: 'Last name',
};
export const orgs = Template.bind({});
orgs.args = {
  count: 2070,
  fieldName: 'Organization',
  orgs: [org, org, org, org, org, org, org, org, org, org, org, org],
};
