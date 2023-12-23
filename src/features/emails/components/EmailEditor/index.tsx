import dynamic from 'next/dynamic';
import { EditorProps } from './EmailEditorFrontend';
import { FC } from 'react';

const EmailEditorFrontend = dynamic(import('./EmailEditorFrontend'), {
  ssr: false,
});

const EmailEditor: FC<EditorProps> = ({ initialContent, onSave }) => {
  return (
    <EmailEditorFrontend initialContent={initialContent} onSave={onSave} />
  );
};

export default EmailEditor;
