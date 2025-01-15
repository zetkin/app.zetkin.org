import { Box, Paper } from '@mui/material';
import { useEditorState, useEditorView } from '@remirror/react';
import { FC, useEffect, useState } from 'react';
import { ProsemirrorNode } from 'remirror';

const LinkExtensionUI: FC = () => {
  const state = useEditorState();
  const view = useEditorView();

  const [selectedNodes, setSelectedNodes] = useState<ProsemirrorNode[]>([]);
  const [selectionHasOtherNodes, setSelectionHasOtherNodes] = useState(false);

  const selectionCoords = view.coordsAtPos(state.selection.$from.pos);
  const editorRect = view.dom.getBoundingClientRect();

  const left = selectionCoords.left - editorRect.left;
  const top = selectionCoords.top - editorRect.top;

  useEffect(() => {
    const linkNodes: ProsemirrorNode[] = [];
    setSelectedNodes(linkNodes);
    setSelectionHasOtherNodes(false);
    state.doc.nodesBetween(state.selection.from, state.selection.to, (node) => {
      if (node.isText) {
        if (node.marks.some((mark) => mark.type.name == 'zlink')) {
          linkNodes.push(node);
          setSelectedNodes(linkNodes);
        } else {
          setSelectionHasOtherNodes(true);
        }
      }
    });
  }, [state.selection]);

  const showLinkMaker = selectedNodes.length == 1 && !selectionHasOtherNodes;
  console;

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
