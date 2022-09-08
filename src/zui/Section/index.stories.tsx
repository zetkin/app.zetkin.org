import { Button } from '@material-ui/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Section from '.';

export default {
  component: Section,
  title: 'Atoms/ZetkinSection',
} as ComponentMeta<typeof Section>;

const Template: ComponentStory<typeof Section> = (args) => (
  <div style={{ width: 400 }}>
    <Section action={args.action} title={args.title}>
      Hello this is the content of the ZetkinSection
    </Section>
  </div>
);

export const noAction = Template.bind({});
noAction.args = {
  title: 'A section without action',
};

export const withAction = Template.bind({});
withAction.args = {
  action: (
    <Button color="primary" variant="contained">
      Click me
    </Button>
  ),
  title: 'A section with an action',
};
