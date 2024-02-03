import { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AccessLevelProvider } from 'features/views/hooks/useAccessLevel';
import ViewSurveySubmissionPreview from '.';

export default {
  component: ViewSurveySubmissionPreview,
  title: 'Views/ViewSurveySubmissionPreview',
} as ComponentMeta<typeof ViewSurveySubmissionPreview>;

const Template: ComponentStory<typeof ViewSurveySubmissionPreview> = (args) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  return (
    <AccessLevelProvider>
      <>
        <div>
          <a ref={(elem) => setAnchorEl(elem)}>Cell content</a>
        </div>
        <ViewSurveySubmissionPreview
          anchorEl={anchorEl}
          submissions={args.submissions}
        />
      </>
    </AccessLevelProvider>
  );
};

export const single = Template.bind({});
single.args = {
  submissions: [
    {
      id: 1,
      matchingContent: 'This is the text',
      submitted: '2023-01-22T13:37:00.000',
    },
  ],
};

export const multiple = Template.bind({});
multiple.args = {
  submissions: [
    {
      id: 1,
      matchingContent: 'This is the text',
      submitted: '2023-01-21T13:37:00.000',
    },
    {
      id: 1,
      matchingContent: 'This is the text',
      submitted: '2023-01-22T13:37:00.000',
    },
    {
      id: 1,
      matchingContent: 'This is the text',
      submitted: '2023-01-23T13:37:00.000',
    },
  ],
};
