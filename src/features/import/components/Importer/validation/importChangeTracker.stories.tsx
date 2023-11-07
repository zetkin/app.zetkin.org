import ImportChangeTracker from './importChangeTracker';
import mockOrganization from 'utils/testing/mocks/mockOrganization';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ImportChangeTracker,
  title: 'Import/ImportChangeTracker',
} as ComponentMeta<typeof ImportChangeTracker>;

const Template: ComponentStory<typeof ImportChangeTracker> = (args) => (
  <ImportChangeTracker
    changedNum={args.changedNum}
    fieldName={args.fieldName}
    orgsStates={args.orgsStates}
  />
);
const org = mockOrganization();

export const firstName = Template.bind({});
firstName.args = {
  changedNum: 7,
  fieldName: 'First name',
};

export const lastName = Template.bind({});
lastName.args = {
  changedNum: 43,
  fieldName: 'Last name',
};
export const orgs = Template.bind({});
orgs.args = {
  changedNum: 2070,
  fieldName: 'Organization',
  orgsStates: [org, org, org, org, org, org, org, org, org, org, org, org],
};
