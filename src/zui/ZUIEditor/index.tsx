import {
  EditorComponent,
  OnChangeJSON,
  Remirror,
  useActive,
  useCommands,
  useRemirror,
} from '@remirror/react';
import { FC, useState } from 'react';
import { BoldExtension } from 'remirror/extensions';
import { RemirrorContentType } from 'remirror';
import { Button } from '@mui/material';

import ButtonExtension from './extensions/ButtonExtension';

const Menu = () => {
  const active = useActive();
  const { insertButton, toggleBold, focus } = useCommands();

  return (
    <>
      <Button
        onClick={() => {
          toggleBold();
          focus();
        }}
        sx={{
          color: active.bold() ? 'black' : '',
        }}
        variant="outlined"
      >
        B
      </Button>
      <Button
        disabled={!insertButton.enabled()}
        onClick={() => {
          insertButton();
          focus();
        }}
        variant="outlined"
      >
        Add button
      </Button>
    </>
  );
};

const ZUIEditor: FC = () => {
  const [content, setContent] = useState<RemirrorContentType>();
  const { manager, state } = useRemirror({
    content,
    extensions: () => [new BoldExtension({}), new ButtonExtension()],
    selection: 'start',
  });

  return (
    <div style={{ minHeight: '200px' }}>
      <Remirror initialContent={state} manager={manager}>
        <EditorComponent />
        <Menu />
        <OnChangeJSON
          onChange={(updatedContent) => setContent(updatedContent)}
        />
      </Remirror>
    </div>
  );
};

export default ZUIEditor;
