import { Box, Paper } from '@mui/material';
import {
  useActive,
  useEditorState,
  useEditorView,
  useExtension,
} from '@remirror/react';
import { FC } from 'react';

import LinkExtension from './extensions/LinkExtension';

const LinkExtensionUI: FC = () => {
  const active = useActive();
  const state = useEditorState();
  const linkExtension = useExtension(LinkExtension);
  const view = useEditorView();

  const selectionCoords = view.coordsAtPos(state.selection.$from.pos);
  const editorRect = view.dom.getBoundingClientRect();

  const left = selectionCoords.left - editorRect.left;
  const top = selectionCoords.top - editorRect.top;

  const linkIsSelected = state.doc.rangeHasMark(
    state.selection.from,
    state.selection.to,
    linkExtension.type
  );

  const showLinkMaker = active.zlink() || linkIsSelected;

  return (
    <Box position="relative">
      <Box
        sx={{
          left: left,
          position: 'absolute',
          top: top + 20,
        }}
      >
        {showLinkMaker && (
          <Paper elevation={1}>
            <Box padding={1}>Hej</Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default LinkExtensionUI;
