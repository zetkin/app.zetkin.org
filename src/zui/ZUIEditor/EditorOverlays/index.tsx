import {
  useEditorEvent,
  useEditorState,
  useEditorView,
  usePositioner,
} from '@remirror/react';
import { FC, useCallback, useEffect, useState } from 'react';
import { ProsemirrorNode } from '@remirror/pm/suggest';
import { Box, useTheme } from '@mui/material';
import { FromToProps, isNodeSelection } from 'remirror';
import { Attrs } from '@remirror/pm/model';

import BlockToolbar from './BlockToolbar/index';
import BlockInsert from './BlockInsert';
import BlockMenu from './BlockMenu';
import useBlockMenu from './useBlockMenu';

export type BlockDividerData = {
  pos: number;
  y: number;
};

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'orderedList'
  | 'bulletList'
  | 'zimage'
  | 'zbutton';

type BlockData = {
  attributes: Attrs;
  node: ProsemirrorNode;
  range: FromToProps;
  rect: DOMRect;
  type: BlockType;
};

type Props = {
  blocks: {
    id: string;
    label: string;
  }[];
  editable: boolean;
  enableBold: boolean;
  enableItalic: boolean;
  enableLink: boolean;
  enableVariable: boolean;
  focused: boolean;
};

const EditorOverlays: FC<Props> = ({
  blocks,
  editable,
  enableBold,
  enableItalic,
  enableLink,
  enableVariable,
  focused,
}) => {
  const theme = useTheme();
  const view = useEditorView();
  const state = useEditorState();
  const positioner = usePositioner('cursor');
  const { isOpen: showBlockMenu } = useBlockMenu(blocks);

  const [typing, setTyping] = useState(false);
  const [mouseY, setMouseY] = useState(-Infinity);
  const [currentBlock, setCurrentBlock] = useState<BlockData | null>(null);

  const findSelectedNode = useCallback(() => {
    if (isNodeSelection(state.selection)) {
      const selection = state.selection;
      const posBefore = selection.$anchor.before(1);
      const posAfter = selection.$head.after(1);
      const elem = view.nodeDOM(posBefore);
      if (elem instanceof HTMLElement) {
        const nodeElem = elem;
        const editorRect = view.dom.getBoundingClientRect();
        const nodeRect = nodeElem.getBoundingClientRect();
        const x = nodeRect.x - editorRect.x;
        const y = nodeRect.y - editorRect.y;
        setCurrentBlock({
          attributes: selection.node.attrs,
          node: selection.node,
          range: {
            from: posBefore,
            to: posAfter,
          },
          rect: {
            ...nodeRect.toJSON(),
            left: x,
            top: y,
            x: x,
            y: y,
          },
          type: selection.node.type.name as BlockType,
        });
      }
    } else {
      const pos = state.selection.$head.pos;
      const resolved = state.doc.resolve(pos);
      const node = resolved.node(1);
      if (node) {
        const posBeforeTextContent = resolved.before(1);
        const posAfterTextContent = resolved.after(1);
        const elem = view.nodeDOM(posBeforeTextContent);
        if (elem instanceof HTMLElement) {
          const nodeElem = elem;
          const editorRect = view.dom.getBoundingClientRect();
          const nodeRect = nodeElem.getBoundingClientRect();
          const x = nodeRect.x - editorRect.x;
          const y = nodeRect.y - editorRect.y;
          setCurrentBlock({
            attributes: node.attrs,
            node,
            range: {
              from: posBeforeTextContent,
              to: posAfterTextContent,
            },
            rect: {
              ...nodeRect.toJSON(),
              left: x,
              top: y,
              x: x,
              y: y,
            },
            type: node.type.name as BlockType,
          });
        }
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
      y: 8,
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

  const isEmptyParagraph =
    currentBlock?.type == 'paragraph' && currentBlock?.node.textContent == '';

  const showBlockToolbar =
    focused &&
    editable &&
    !showBlockMenu &&
    !!currentBlock &&
    !typing &&
    !isEmptyParagraph;

  const showBlockInsert =
    editable && blocks.length > 0 && !showBlockMenu && !typing;

  const showSelectedBlockOutline = focused && editable && !!currentBlock;

  return (
    <>
      {showSelectedBlockOutline && (
        <Box position="relative">
          <Box
            border={`1px solid ${theme.palette.grey[500]}`}
            borderRadius={1}
            height={currentBlock?.rect.height + 16}
            left={currentBlock?.rect.left - 8}
            position="absolute"
            sx={{
              pointerEvents: 'none',
            }}
            top={currentBlock?.rect.top - 8}
            width={currentBlock?.rect.width + 16}
            zIndex={-1}
          />
        </Box>
      )}
      {showBlockToolbar && (
        <BlockToolbar
          blockAttributes={currentBlock.attributes}
          blockType={currentBlock.type}
          curBlockY={currentBlock.rect.y}
          enableBold={enableBold}
          enableItalic={enableItalic}
          enableLink={enableLink}
          enableVariable={enableVariable}
          range={currentBlock.range}
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
