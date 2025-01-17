import { Box, Button, Paper, TextField } from '@mui/material';
import { useCommands, useEditorState, useEditorView } from '@remirror/react';
import { FC, useEffect, useState } from 'react';
import { ProsemirrorNode } from 'remirror';

import formatUrl from 'utils/formatUrl';

export type NodeWithPosition = {
  from: number;
  node: ProsemirrorNode;
  to: number;
};

const LinkExtensionUI: FC = () => {
  const state = useEditorState();
  const view = useEditorView();
  const { removeLink, removeUnfinishedLinks, updateLink, updateLinkText } =
    useCommands();

  const [selectedNodes, setSelectedNodes] = useState<NodeWithPosition[]>([]);
  const [selectionHasOtherNodes, setSelectionHasOtherNodes] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkHref, setLinkHref] = useState('');

  const selectionCoords = view.coordsAtPos(state.selection.$from.pos);
  const editorRect = view.dom.getBoundingClientRect();

  const left = selectionCoords.left - editorRect.left;
  const top = selectionCoords.top - editorRect.top;

  const showLinkMaker = selectedNodes.length == 1 && !selectionHasOtherNodes;

  useEffect(() => {
    if (!showLinkMaker) {
      removeUnfinishedLinks();
    }
  }, [showLinkMaker]);

  useEffect(() => {
    const selectedNode = selectedNodes[0]?.node;
    if (selectedNode) {
      setLinkText(selectedNode.text || '');
      const mark = selectedNode.marks.find((mark) => mark.type.name == 'zlink');
      setLinkHref(mark?.attrs.href || '');
    }
  }, [selectedNodes[0]]);

  useEffect(() => {
    const linkNodes: NodeWithPosition[] = [];
    let hasOtherNodes = false;
    state.doc.nodesBetween(
      state.selection.from,
      state.selection.to,
      (node, index) => {
        if (node.isText) {
          if (node.marks.some((mark) => mark.type.name == 'zlink')) {
            linkNodes.push({ from: index, node, to: index + node.nodeSize });
          } else {
            hasOtherNodes = true;
          }
        }
      }
    );
    setSelectedNodes(linkNodes);
    setSelectionHasOtherNodes(hasOtherNodes);
  }, [state.selection]);

  const formattedHref = formatUrl(linkHref);

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
              <Box display="flex">
                <Button
                  disabled={!formattedHref}
                  onClick={() => {
                    updateLink({ href: formattedHref || '' });
                    updateLinkText(
                      { from: selectedNodes[0].from, to: selectedNodes[0].to },
                      linkText
                    );
                  }}
                  variant="outlined"
                >
                  Apply
                </Button>
                <Button
                  disabled={!linkHref}
                  onClick={() =>
                    removeLink({
                      from: selectedNodes[0].from,
                      to: selectedNodes[0].to,
                    })
                  }
                  variant="outlined"
                >
                  Remove
                </Button>
                <Button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    setSelectedNodes([]);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default LinkExtensionUI;
