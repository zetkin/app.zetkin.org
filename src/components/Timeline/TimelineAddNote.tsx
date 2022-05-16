import React from 'react';
import { useIntl } from 'react-intl';

import TextEditor from './TextEditor';

const TimelineAddNote: React.FunctionComponent = () => {
  const intl = useIntl();

  return (
    <TextEditor
      initialValue={[
        {
          children: [{ text: '' }],
          type: 'paragraph',
        },
      ]}
      onChange={(value) => console.log(value)}
      placeholder={intl.formatMessage({
        id: 'misc.timeline.add_note_placeholder',
      })}
    />
  );
};

export default TimelineAddNote;
