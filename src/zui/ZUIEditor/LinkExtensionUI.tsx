import { Box, Button, Paper, TextField } from '@mui/material';
import { useCommands, useEditorState, useEditorView } from '@remirror/react';
import { FC, useEffect, useState } from 'react';
import { ProsemirrorNode } from 'remirror';

const LinkExtensionUI: FC = () => {
  const state = useEditorState();
  const view = useEditorView();
  const { updateLink } = useCommands();

  const [selectedNodes, setSelectedNodes] = useState<ProsemirrorNode[]>([]);
  const [selectionHasOtherNodes, setSelectionHasOtherNodes] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkHref, setLinkHref] = useState('');

  const selectionCoords = view.coordsAtPos(state.selection.$from.pos);
  const editorRect = view.dom.getBoundingClientRect();

  const left = selectionCoords.left - editorRect.left;
  const top = selectionCoords.top - editorRect.top;

  useEffect(() => {
    const selectedNode = selectedNodes[0];
    if (selectedNode) {
      setLinkText(selectedNode.text || '');
      const mark = selectedNode.marks.find((mark) => mark.type.name == 'zlink');
      setLinkHref(mark?.attrs.href || '');
    }
  }, [selectedNodes[0]]);

  useEffect(() => {
    const linkNodes: ProsemirrorNode[] = [];
    let hasOtherNodes = false;
    state.doc.nodesBetween(state.selection.from, state.selection.to, (node) => {
      if (node.isText) {
        if (node.marks.some((mark) => mark.type.name == 'zlink')) {
          linkNodes.push(node);
        } else {
          hasOtherNodes = true;
        }
      }
    });
    setSelectedNodes(linkNodes);
    setSelectionHasOtherNodes(hasOtherNodes);
  }, [state.selection]);

  const showLinkMaker = selectedNodes.length == 1 && !selectionHasOtherNodes;

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
            <Box display="flex" flexDirection="column" gap={1} padding={1}>
              <TextField
                onChange={(ev) => setLinkText(ev.target.value)}
                value={linkText}
              />
              <TextField
                onChange={(ev) => setLinkHref(ev.target.value)}
                value={linkHref}
              />
              <Button
                onClick={() => updateLink({ href: linkHref })}
                variant="outlined"
              >
                Apply
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default LinkExtensionUI;
