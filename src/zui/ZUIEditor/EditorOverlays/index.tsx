import {
  useEditorEvent,
  useEditorState,
  useEditorView,
  usePositioner,
} from '@remirror/react';
import { FC, useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';

import BlockToolbar from './BlockToolbar';
import BlockInsert from './BlockInsert';
import BlockMenu from './BlockMenu';
import useBlockMenu from './useBlockMenu';

export type BlockDividerData = {
  pos: number;
  y: number;
};

type BlockData = {
  rect: DOMRect;
  type: string;
};

type Props = {
  blocks: {
    id: string;
    label: string;
  }[];
  enableVariable: boolean;
};

const EditorOverlays: FC<Props> = ({ blocks, enableVariable }) => {
  const view = useEditorView();
  const state = useEditorState();
  const positioner = usePositioner('cursor');
  const { isOpen: showBlockMenu } = useBlockMenu(blocks);

  const [typing, setTyping] = useState(false);
  const [mouseY, setMouseY] = useState(-Infinity);
  const [currentBlock, setCurrentBlock] = useState<BlockData | null>(null);

  const findSelectedNode = useCallback(() => {
    const pos = state.selection.$head.pos;
    const resolved = state.doc.resolve(pos);
    const node = resolved.node(1);
    if (node) {
      const posBeforeTextContent = resolved.before(1);
      const elem = view.nodeDOM(posBeforeTextContent);
      if (elem instanceof HTMLElement) {
        const nodeElem = elem;
        const editorRect = view.dom.getBoundingClientRect();
        const nodeRect = nodeElem.getBoundingClientRect();
        const x = nodeRect.x - editorRect.x;
        const y = nodeRect.y - editorRect.y;
        setCurrentBlock({
          rect: {
            ...nodeRect.toJSON(),
            left: x,
            top: y,
            x: x,
            y: y,
          },
          type: node.type.name,
        });
      }
    }
  }, [view, state.selection]);

  useEffect(() => {
    const observer = new ResizeObserver(findSelectedNode);
    if (view.dom) {
      observer.observe(view.dom);
    }

    return () => observer.disconnect();
  }, [view.dom, findSelectedNode, state.selection]);

  useEditorEvent('keyup', () => {
    setTyping(true);
  });

  useEffect(() => {
    const handleMouseMove = (ev: Event) => {
      if (ev.type == 'mousemove') {
        const mouseEvent = ev as MouseEvent;
        const editorRect = view.dom.getBoundingClientRect();
        setMouseY(mouseEvent.clientY - editorRect.y);
      }
      setTyping(false);
    };

    view.root.addEventListener('mousemove', handleMouseMove);

    return () => {
      view.root.removeEventListener('mousemove', handleMouseMove);
    };
  }, [view.root]);

  useEffect(() => {
    findSelectedNode();
  }, [state.selection]);

  let pos = 0;
  const blockDividers: BlockDividerData[] = [
    {
      pos: 0,
      y: 20,
    },
  ];

  const containerRect = view.dom.getBoundingClientRect();
  state.doc.children.forEach((blockNode) => {
    const elem = view.nodeDOM(pos);

    pos += blockNode.nodeSize;

    if (elem instanceof HTMLElement) {
      if (elem.nodeName == 'P' && elem.textContent?.trim().length == 0) {
        return;
      }

      const rect = elem.getBoundingClientRect();

      blockDividers.push({
        pos,
        y: rect.bottom - containerRect.top,
      });
    }
  });

  const showBlockToolbar = !showBlockMenu && !!currentBlock && !typing;

  const showBlockInsert = !showBlockMenu && !typing;

  const showSelectedBlockOutline = !!currentBlock;

  return (
    <>
      {showSelectedBlockOutline && (
        <Box position="relative">
          <Box
            border={1}
            height={currentBlock?.rect.height}
            left={currentBlock?.rect.left}
            position="absolute"
            sx={{ pointerEvents: 'none' }}
            top={currentBlock?.rect.top}
            width={currentBlock?.rect.width}
          />
        </Box>
      )}
      {showBlockToolbar && (
        <BlockToolbar
          curBlockType={currentBlock.type}
          curBlockY={currentBlock.rect.y}
          enableVariable={enableVariable}
          pos={state.selection.$anchor.pos}
        />
      )}
      {showBlockInsert && (
        <BlockInsert blockDividers={blockDividers} mouseY={mouseY} />
      )}
      <Box position="relative">
        <Box
          ref={positioner.ref}
          sx={{
            left: positioner.x,
            position: 'absolute',
            top: positioner.y,
          }}
        >
          {showBlockMenu && <BlockMenu blocks={blocks} />}
        </Box>
      </Box>
    </>
  );
};

export default EditorOverlays;
