import { Box, Button, Paper } from '@mui/material';
import {
  useCommands,
  useEditorEvent,
  useEditorState,
  useEditorView,
} from '@remirror/react';
import { FC, useEffect, useState } from 'react';
import { findParentNode, isNodeSelection, ProsemirrorNode } from 'remirror';

const BlockToolbar: FC = () => {
  const [typing, setTyping] = useState(false);
  const [curBlockPos, setCurBlockPos] = useState<number>(-1);
  const [curBlockType, setCurBlockType] = useState<string>();
  const view = useEditorView();
  const state = useEditorState();
  const { setImageFile } = useCommands();

  useEditorEvent('keyup', () => {
    setTyping(true);
  });

  useEffect(() => {
    if (view.root) {
      const handleMove = () => {
        setTyping(false);
      };

      view.root.addEventListener('mousemove', handleMove);

      return () => view.root.removeEventListener('mousemove', handleMove);
    }
  }, [view.root]);

  useEffect(() => {
    let node: ProsemirrorNode | null = null;
    let nodeElem: HTMLElement | null = null;
    if (isNodeSelection(state.selection)) {
      const elem = view.nodeDOM(state.selection.$from.pos);
      if (elem instanceof HTMLElement) {
        node = state.selection.node;
        nodeElem = elem;
      }
    } else {
      const result = findParentNode({
        predicate: () => true,
        selection: state.selection,
      });

      if (result) {
        node = result.node;
        let elem = view.nodeDOM(result.start);

        while (
          elem &&
          elem.parentNode &&
          elem.parentElement?.contentEditable != 'true'
        ) {
          elem = elem.parentNode;
        }

        if (elem instanceof HTMLElement) {
          nodeElem = elem;
        }
      }
    }

    if (node && nodeElem) {
      const editorRect = view.dom.getBoundingClientRect();
      const nodeRect = nodeElem.getBoundingClientRect();
      setCurBlockPos(nodeRect.y - editorRect.y);
      setCurBlockType(node.type.name);
    }
  }, [state.selection]);

  const showBar =
    curBlockType && curBlockPos >= 0 && view.hasFocus() && !typing;

  return (
    <Box position="relative">
      <Box
        sx={{
          left: 0,
          opacity: showBar ? 1 : 0,
          pointerEvents: showBar ? 'auto' : 'none',
          position: 'absolute',
          top: curBlockPos - 32,
          transition: 'opacity 0.5s',
          zIndex: 10000,
        }}
      >
        <Paper elevation={1} sx={{ p: 1 }}>
          {curBlockType}
          {curBlockType == 'zimage' && (
            <Button onClick={() => setImageFile(null)}>Change image</Button>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default BlockToolbar;
