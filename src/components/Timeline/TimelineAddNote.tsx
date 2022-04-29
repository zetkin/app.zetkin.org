import React from 'react';
import TextEditor from './TextEditor';

const TimelineAddNote: React.FunctionComponent = () => {
  return (
    <TextEditor
      initialValue={[
        {
          children: [{ text: 'Add a new note' }],
          type: 'paragraph',
        },
      ]}
    />
  );
};

export default TimelineAddNote;
