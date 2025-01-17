import { OpenInNew } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, TextField } from '@mui/material';
import { useCommands, useEditorState, useEditorView } from '@remirror/react';
import { FC, useEffect, useState } from 'react';
import { ProsemirrorNode } from 'remirror';

import { Msg } from 'core/i18n';
import formatUrl from 'utils/formatUrl';
import messageIds from 'zui/l10n/messageIds';

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
          minWidth: 300,
          position: 'absolute',
          top: top + 20,
        }}
      >
        {showLinkMaker && (
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
                  size="small"
                  value={linkText}
                />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    setSelectedNodes([]);
                  }}
                  size="small"
                >
                  <Msg id={messageIds.editor.extensions.link.cancel} />
                </Button>

                <Box display="flex" gap={1}>
                  <Button
                    disabled={!linkHref}
                    onClick={() =>
                      removeLink({
                        from: selectedNodes[0].from,
                        to: selectedNodes[0].to,
                      })
                    }
                    size="small"
                    variant="text"
                  >
                    <Msg id={messageIds.editor.extensions.link.remove} />
                  </Button>
                  <Button
                    disabled={!formattedHref}
                    onClick={() => {
                      updateLink({ href: formattedHref || '' });
                      updateLinkText(
                        {
                          from: selectedNodes[0].from,
                          to: selectedNodes[0].to,
                        },
                        linkText
                      );
                    }}
                    size="small"
                    variant="outlined"
                  >
                    <Msg id={messageIds.editor.extensions.link.apply} />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default LinkExtensionUI;
