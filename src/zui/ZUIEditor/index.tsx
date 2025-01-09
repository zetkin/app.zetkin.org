import {
  EditorComponent,
  OnChangeJSON,
  Remirror,
  useActive,
  useAttrs,
  useCommands,
  useRemirror,
} from '@remirror/react';
import { FC, useState } from 'react';
import { BoldExtension } from 'remirror/extensions';
import { RemirrorContentType } from 'remirror';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { LinkOff, LinkOutlined } from '@mui/icons-material';
import { FloatingToolbar } from '@remirror/react-ui';

import LinkExtension from './extensions/LinkExtension';
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

const InlineToolbar = () => {
  const active = useActive();
  const { toggleLink, updateLink } = useCommands();
  const [linkToolsOpen, setLinkToolsOpen] = useState(false);

  const url = (useAttrs().zlink()?.href as string) ?? '';
  const [href, setHref] = useState(url);

  //definiera en funktion som uppdaterar attributet href på noden

  if (active.zbutton()) {
    return null;
  }

  const selectionHasLink = active.zlink();

  return (
    <FloatingToolbar
      placement="top"
      positioner="selection"
      style={{ zIndex: 10000 }}
    >
      <Box border={1}>
        {linkToolsOpen && (
          <Box display="flex" flexDirection="column" padding={1}>
            <TextField
              onChange={(ev) => {
                setHref(ev.target.value);
                updateLink({ href });
              }}
              size="small"
              value={href}
            />
            <Button
              onClick={() => {
                toggleLink();
                //kör funktionen som lägger till href-attributet på länken
                setLinkToolsOpen(false);
              }}
              variant="outlined"
            >
              Add the link
            </Button>
          </Box>
        )}
        {!linkToolsOpen && (
          <IconButton
            onClick={() => {
              if (selectionHasLink) {
                toggleLink(); //removes the link
              } else {
                setLinkToolsOpen(true);
              }
            }}
          >
            {selectionHasLink ? <LinkOff /> : <LinkOutlined />}
          </IconButton>
        )}
      </Box>
    </FloatingToolbar>
  );
};

const ZUIEditor: FC = () => {
  const [content, setContent] = useState<RemirrorContentType>();
  const { manager, state } = useRemirror({
    content,
    extensions: () => [
      new BoldExtension({}),
      new ButtonExtension(),
      new LinkExtension(),
    ],
    selection: 'start',
  });

  return (
    <div style={{ minHeight: '200px' }}>
      <Remirror initialContent={state} manager={manager}>
        <InlineToolbar />
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
