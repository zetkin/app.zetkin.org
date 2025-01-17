import { OpenInNew } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, TextField } from '@mui/material';
import { useCommands, useEditorState, useEditorView } from '@remirror/react';
import { FC, useEffect, useState } from 'react';
import { ProsemirrorNode } from 'remirror';

import { Msg, useMessages } from 'core/i18n';
import formatUrl from 'utils/formatUrl';
import messageIds from 'zui/l10n/messageIds';

const ButtonExtensionUI: FC = () => {
  const state = useEditorState();
  const view = useEditorView();
  const messages = useMessages(messageIds);
  const { setButtonHref, setButtonText } = useCommands();

  const [visible, setVisible] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkHref, setLinkHref] = useState('');

  const selectionCoords = view.coordsAtPos(state.selection.$from.pos);
  const editorRect = view.dom.getBoundingClientRect();

  const left = selectionCoords.left - editorRect.left;
  const top = selectionCoords.top - editorRect.top;

  useEffect(() => {
    const blockNodes: ProsemirrorNode[] = [];
    state.doc.nodesBetween(state.selection.from, state.selection.to, (node) => {
      if (!node.isText) {
        blockNodes.push(node);
      }
    });

    if (blockNodes.length == 1 && blockNodes[0].type.name == 'zbutton') {
      const buttonNode = blockNodes[0];
      setLinkText(buttonNode.textContent || '');
      setLinkHref(buttonNode.attrs.href || '');
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [state.selection]);

  const formattedHref = formatUrl(linkHref);
  const canSubmit = !!formattedHref && linkText.length > 0;

  return (
    <Box position="relative">
      <Box
        sx={{
          left: left,
          minWidth: 300,
          position: 'absolute',
          top: top + 20,
        }}
      >
        {visible && (
          <Paper elevation={1}>
            <Box
              alignItems="stretch"
              display="flex"
              flexDirection="column"
              gap={1}
              padding={1}
            >
              <Box display="flex">
                <TextField
                  fullWidth
                  onChange={(ev) => setLinkHref(ev.target.value)}
                  size="small"
                  value={linkHref}
                />
                <IconButton
                  disabled={!formattedHref}
                  href={formattedHref || ''}
                  target="_blank"
                >
                  <OpenInNew />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <TextField
                  fullWidth
                  onChange={(ev) => setLinkText(ev.target.value)}
                  placeholder={messages.editor.extensions.link.textPlaceholder()}
                  size="small"
                  value={linkText}
                />
              </Box>
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    // TODO: Deselect button, or hide?
                  }}
                  size="small"
                >
                  <Msg id={messageIds.editor.extensions.link.cancel} />
                </Button>

                <Button
                  disabled={!canSubmit}
                  onClick={() => {
                    setButtonText(state.selection.$head.pos, linkText);
                    setButtonHref(state.selection.$head.pos, linkHref);
                  }}
                  size="small"
                  variant="outlined"
                >
                  <Msg id={messageIds.editor.extensions.link.apply} />
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default ButtonExtensionUI;
