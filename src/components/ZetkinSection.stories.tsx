import { Button } from '@material-ui/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZetkinSection from './ZetkinSection';

export default {
  component: ZetkinSection,
  title: 'Atoms/ZetkinSection',
} as ComponentMeta<typeof ZetkinSection>;

const Template: ComponentStory<typeof ZetkinSection> = (args) => (
  <div style={{ width: 400 }}>
    <ZetkinSection action={args.action} title={args.title}>
      Hello this is the content of the ZetkinSection
    </ZetkinSection>
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
