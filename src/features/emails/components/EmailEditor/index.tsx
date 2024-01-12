import dynamic from 'next/dynamic';
import { FC } from 'react';

import { EditorProps } from './EmailEditorFrontend';

const EmailEditorFrontend = dynamic(import('./EmailEditorFrontend'), {
  ssr: false,
});

const EmailEditor: FC<EditorProps> = ({ initialContent, onSave }) => {
  return (
    <EmailEditorFrontend initialContent={initialContent} onSave={onSave} />
  );
};

export default EmailEditor;
