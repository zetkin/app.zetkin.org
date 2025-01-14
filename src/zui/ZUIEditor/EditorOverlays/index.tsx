import {
  useEditorEvent,
  useEditorState,
  useEditorView,
  usePositioner,
} from '@remirror/react';
import { FC, useCallback, useEffect, useState } from 'react';
import { findParentNode, isNodeSelection, ProsemirrorNode } from 'remirror';
import { Box } from '@mui/material';

import BlockToolbar from './BlockToolbar';
import BlockInsert from './BlockInsert';
import BlockMenu from './BlockMenu';
import useBlockMenu from './useBlockMenu';

export type BlockDividerData = {
  pos: number;
  y: number;
};

type Props = {
  blocks: {
    id: string;
    label: string;
  }[];
};

const EditorOverlays: FC<Props> = ({ blocks }) => {
  const view = useEditorView();
  const state = useEditorState();
  const positioner = usePositioner('cursor');
  const { isOpen: showBlockMenu } = useBlockMenu(blocks);

  const [typing, setTyping] = useState(false);
  const [mouseY, setMouseY] = useState(-Infinity);

  //ett "curBlock"-state
  const [curBlockRect, setCurBlockRect] = useState<DOMRect | null>(null);
  const [curBlockType, setCurBlockType] = useState<string>();

  const findSelectedNode = useCallback(() => {
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
      const x = nodeRect.x - editorRect.x;
      const y = nodeRect.y - editorRect.y;
      setCurBlockType(node.type.name);
      setCurBlockRect({
        ...nodeRect.toJSON(),
        left: x,
        top: y,
        x: x,
        y: y,
      });
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

  const showBlockToolbar =
    !showBlockMenu && !!curBlockType && view.hasFocus() && !typing;

  const showBlockInsert = !showBlockMenu && !typing;

  return (
    <>
      <Box position="relative">
        <Box
          border={1}
          height={curBlockRect?.height}
          left={curBlockRect?.left}
          position="absolute"
          sx={{ pointerEvents: 'none' }}
          top={curBlockRect?.top}
          width={curBlockRect?.width}
        />
      </Box>
      {showBlockToolbar && (
        <BlockToolbar
          curBlockType={curBlockType || ''}
          curBlockY={curBlockRect?.y ?? 0}
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
