import { Button } from '@mui/material';
import { Meta, StoryFn } from '@storybook/react';

import ZUISection from '.';

export default {
  component: ZUISection,
  title: 'Atoms/ZUISection',
} as Meta<typeof ZUISection>;

const Template: StoryFn<typeof ZUISection> = (args) => (
  <div style={{ width: 400 }}>
    <ZUISection action={args.action} title={args.title}>
      Hello this is the content of the ZUISection
    </ZUISection>
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
