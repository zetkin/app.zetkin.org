import { Add } from '@mui/icons-material';
import { IconButton, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useCommands, useEditorState, useEditorView } from '@remirror/react';
import { FC, useEffect, useState } from 'react';

type BlockDividerData = {
  pos: number;
  y: number;
};

const BlockInsert: FC = () => {
  const view = useEditorView();
  const state = useEditorState();
  const [mouseY, setMouseY] = useState(-Infinity);
  const { insertParagraph, focus } = useCommands();

  useEffect(() => {
    const handleMouseMove = (ev: Event) => {
      if (ev.type == 'mousemove') {
        const mouseEvent = ev as MouseEvent;
        const editorRect = view.dom.getBoundingClientRect();
        setMouseY(mouseEvent.clientY - editorRect.y);
      }
    };

    view.root.addEventListener('mousemove', handleMouseMove);

    return () => {
      view.root.removeEventListener('mousemove', handleMouseMove);
    };
  }, [view.root]);

  let pos = 0;
  const blockDividers: BlockDividerData[] = [
    {
      pos: 0,
      y: 0,
    },
    ...state.doc.children.map((blockNode) => {
      pos += blockNode.nodeSize;
      const rect = view.coordsAtPos(pos - 1);

      const containerRect = view.dom.getBoundingClientRect();

      return {
        pos: pos,
        y: rect.bottom - containerRect.top,
      };
    }),
  ];

  return (
    <Box position="relative">
      {blockDividers.map(({ pos, y }, index) => {
        const visible = Math.abs(mouseY - y) < 20;
        const isFirst = index == 0;
        const offset = isFirst ? -6 : 12;
        return (
          <Box
            key={index}
            sx={{
              bgcolor: 'red',
              display: 'flex',
              height: '1px',
              justifyContent: 'center',
              opacity: visible ? 1 : 0,
              position: 'absolute',
              top: Math.round(y + offset),
              transition: 'opacity 0.5s',
              width: '100%',
            }}
          >
            <Box
              sx={{
                pointerEvents: visible ? 'auto' : 'none',
                position: 'relative',
                top: -16,
              }}
            >
              <Paper>
                <IconButton
                  disabled={!insertParagraph.enabled(' ', { selection: pos })}
                  onClick={() => {
                    insertParagraph(' ', { selection: pos });
                    focus(pos);
                  }}
                >
                  <Add />
                </IconButton>
              </Paper>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default BlockInsert;
