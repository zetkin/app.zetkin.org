import {
  useCommands,
  useEditorEvent,
  useEditorState,
  useEditorView,
  usePositioner,
} from '@remirror/react';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProsemirrorNode } from '@remirror/pm/suggest';
import { Box, lighten, Typography, useTheme } from '@mui/material';
import { FromToProps, isNodeSelection, RemirrorJSON } from 'remirror';
import { ErrorOutline } from '@mui/icons-material';
import { Attrs } from '@remirror/pm/model';
import { useDrop } from 'react-dnd';

import BlockToolbar from './BlockToolbar/index';
import BlockInsert from './BlockInsert';
import BlockMenu from './BlockMenu';
import useBlockMenu from './useBlockMenu';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import { RemirrorBlockType } from '../types';
import editorBlockProblems, {
  BlockProblem,
} from '../utils/editorBlockProblems';
import { areDOMRectRecordsEqual } from 'zui/ZUIEditor/utils/domRects';

export type BlockDividerData = {
  blockIndex: number;
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
  index: number;
  node: ProsemirrorNode;
  range: FromToProps;
  rect: DOMRect;
  type: BlockType;
};

interface DragItem {
  blockIndex: number;
  type: string;
}

const DropZone: FC<{
  index: number;
  isDragging: boolean;
  onDrop: (item: DragItem) => void;
  onHover: (item: DragItem, index: number) => void;
  y: number;
}> = ({ index, isDragging, onDrop, onHover, y }) => {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: 'EDITOR_BLOCK',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (item) => {
      onDrop(item);
    },
    hover: (item) => {
      onHover(item, index);
    },
  });

  const dropZoneOffset = 8;
  const dropZoneHeight = isOver ? 30 : 15;

  if (!isDragging) {
    return null;
  }

  return (
    <Box
      ref={(node: HTMLDivElement | null) => {
        if (node) {
          drop(node);
        }
      }}
      sx={{
        backgroundColor: isOver ? 'primary.main' : 'red',
        height: `${dropZoneHeight}px`,
        left: 0,
        opacity: isOver ? 0.7 : 0.3,
        position: 'absolute',
        right: 0,
        top: `${y + dropZoneOffset - dropZoneHeight / 2}px`,
        transition: 'all 0.15s ease',
        zIndex: 10,
      }}
    />
  );
};

type Props = {
  blocks: {
    id: string;
    label: string;
  }[];
  content: RemirrorJSON[];
  editable: boolean;
  enableBold: boolean;
  enableItalic: boolean;
  enableLink: boolean;
  enableStrikethrough: boolean;
  enableVariable: boolean;
  focused: boolean;
  onSelectBlock?: (selectedBlockIndex: number) => void;
};

const EditorOverlays: FC<Props> = ({
  blocks,
  editable,
  enableBold,
  enableItalic,
  enableLink,
  enableStrikethrough,
  enableVariable,
  focused,
  onSelectBlock,
  content,
}) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const view = useEditorView();
  const state = useEditorState();
  const positioner = usePositioner('cursor');
  const { isOpen: showBlockMenu, filteredBlocks, menu } = useBlockMenu(blocks);

  const [typing, setTyping] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    x: -Infinity,
    y: -Infinity,
  });
  const [currentBlock, setCurrentBlock] = useState<BlockData | null>(null);
  const [draggingBlockIndex, setDraggingBlockIndex] = useState<number | null>(
    null
  );
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggingBlockIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingBlockIndex(null);
    setDropTargetIndex(null);
  }, []);

  const editorRect = view.dom.getBoundingClientRect();

  const problems = useMemo(() => {
    const problems: (BlockProblem[] | null)[] = [];
    state.doc.children.forEach((node, index) => {
      if (
        node.type.name == RemirrorBlockType.PARAGRAPH &&
        node.content.size == 0
      ) {
        problems.push(null);
      } else if (index < content.length) {
        const block = content[index];
        const blockProblems = editorBlockProblems(
          block,
          messages.editor.extensions.button.defaultText()
        );
        problems.push(blockProblems.length > 0 ? blockProblems : null);
      }
    });
    return problems;
  }, [messages.editor.extensions.button, state.doc.children, content]);

  const previousAllBlockRects = useRef<Record<string, DOMRect> | null>(null);

  const allBlockRects = useMemo(() => {
    const rects: Record<string, DOMRect> = {};

    state.doc.descendants((node, pos, parent, index) => {
      const elem = view.nodeDOM(pos);
      if (elem instanceof HTMLElement) {
        const nodeRect = elem.getBoundingClientRect();
        const x = nodeRect.x - editorRect.x;
        const y = nodeRect.y - editorRect.y;

        rects[index] = {
          ...nodeRect.toJSON(),
          left: x,
          top: y,
          x: x,
          y: y,
        };
      }

      return false;
    });

    if (areDOMRectRecordsEqual(rects, previousAllBlockRects.current)) {
      return previousAllBlockRects.current;
    }

    return rects;
  }, [editorRect.x, editorRect.y, state.doc, view]);

  const findSelectedNode = useCallback(() => {
    const selection = state.selection;
    const resolved = state.doc.resolve(selection.$head.pos);
    let node = resolved.node(1);

    let posBefore: number;
    let posAfter: number;
    let index: number;

    if (node) {
      posBefore = resolved.before(1);
      posAfter = resolved.after(1);
      index = resolved.index(0);
    } else {
      index = selection.$anchor.index(0);
      posBefore = selection.$anchor.before(1);
      posAfter = selection.$head.after(1);

      if (isNodeSelection(selection)) {
        node = selection.node;
      } else if (index < state.doc.childCount) {
        node = state.doc.child(index);
      }
    }

    if (!node) {
      return;
    }

    const elem = view.nodeDOM(posBefore);
    if (elem instanceof HTMLElement && allBlockRects?.[index]) {
      onSelectBlock?.(index);
      setCurrentBlock({
        attributes: node.attrs,
        index,
        node: node,
        range: {
          from: posBefore,
          to: posAfter,
        },
        rect: allBlockRects?.[index],
        type: node.type.name as BlockType,
      });
    }
  }, [state.selection, state.doc, view, onSelectBlock, allBlockRects]);

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
        setMousePosition({
          x: mouseEvent.clientX,
          y: mouseEvent.clientY - editorRect.y,
        });
      }
      setTyping(false);
    };

    view.root.addEventListener('mousemove', handleMouseMove);

    return () => {
      view.root.removeEventListener('mousemove', handleMouseMove);
    };
  }, [view.root, view.dom]);

  useEffect(() => {
    findSelectedNode();
  }, [state.selection, findSelectedNode]);

  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }

      requestAnimationFrame(() => {
        setLayoutReady(true);
      });
    };

    run();
  }, []);

  const blockDividers = useMemo(() => {
    if (!view.dom.offsetHeight || !layoutReady) {
      return [];
    }

    const containerRect = view.dom.getBoundingClientRect();
    let blockIndex = 0;
    const dividers: BlockDividerData[] = [{ blockIndex: -1, pos: 0, y: 8 }];

    state.doc.descendants((node, pos) => {
      const elem = view.nodeDOM(pos);
      if (
        elem instanceof HTMLElement &&
        !(node.type.name === 'paragraph' && node.content.size === 0)
      ) {
        const rect = elem.getBoundingClientRect();
        dividers.push({
          blockIndex,
          pos: pos + node.nodeSize,
          y: rect.bottom - containerRect.top,
        });
      }

      blockIndex++;
      return false;
    });

    return dividers;
  }, [state.doc, view, layoutReady]);

  const isEmptyParagraph =
    currentBlock?.type == 'paragraph' && currentBlock?.node.textContent == '';

  const showBlockToolbar =
    focused &&
    editable &&
    !showBlockMenu &&
    !!currentBlock &&
    !typing &&
    !isEmptyParagraph;

  const test = view.dom.getBoundingClientRect();
  const mouseIsInsideEditor =
    mousePosition.x > test.left && mousePosition.x < test.right;

  const showBlockInsert =
    editable &&
    blocks.length > 0 &&
    !showBlockMenu &&
    !typing &&
    mouseIsInsideEditor;

  const showSelectedBlockOutline = focused && editable && !!currentBlock;

  const { moveBlockToIndex } = useCommands();

  const handleDrop = useCallback(
    (item: DragItem) => {
      if (dropTargetIndex === null) {
        setDraggingBlockIndex(null);
        setDropTargetIndex(null);
        return;
      }

      const fromIndex = item.blockIndex;
      const toIndex = dropTargetIndex + 1;

      if (fromIndex !== toIndex) {
        moveBlockToIndex(fromIndex, toIndex);
      }

      setDraggingBlockIndex(null);
      setDropTargetIndex(null);
    },
    [dropTargetIndex, moveBlockToIndex]
  );

  const handleDropTargetChanged = useCallback(
    (item: DragItem, targetIndex: number) => {
      const fromIndex = item.blockIndex;
      const adjustedTargetIndex =
        fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
      setDropTargetIndex(adjustedTargetIndex);
    },
    []
  );

  return (
    <>
      {problems.map((blockProblems, index) => {
        if (!blockProblems) {
          return null;
        }
        const rect = allBlockRects?.[index];
        if (!rect) {
          return null;
        }
        return (
          <Box key={index} position="relative">
            <Box
              alignItems="cetner"
              bgcolor={lighten(theme.palette.error.light, 0.5)}
              borderRadius="0 4px 0 3px"
              display="flex"
              gap={0.5}
              left={1}
              padding={0.5}
              position="absolute"
              top={rect.height + rect.top - 21}
            >
              <ErrorOutline color="error" fontSize="small" />
              <Typography color={theme.palette.error.dark} fontSize="13px">
                <Msg id={messageIds.editor.blockProblems[blockProblems[0]]} />
              </Typography>
            </Box>
            <Box
              border={`1px solid ${theme.palette.error.main}`}
              borderRadius={1}
              height={rect.height + 16}
              left={rect.left - 8}
              position="absolute"
              sx={{
                pointerEvents: 'none',
              }}
              top={rect.top - 8}
              width={rect.width + 16}
              zIndex={-1}
            />
          </Box>
        );
      })}
      {showSelectedBlockOutline && (
        <Box position="relative">
          <Box
            border={`1px solid ${theme.palette.grey[500]}`}
            borderRadius={1}
            height={currentBlock.rect.height + 16}
            left={currentBlock.rect.left - 8}
            position="absolute"
            sx={{
              pointerEvents: 'none',
            }}
            top={currentBlock.rect.top - 8}
            width={currentBlock.rect.width + 16}
            zIndex={-2}
          />
        </Box>
      )}
      {showBlockToolbar && currentBlock && (
        <BlockToolbar
          blockAttributes={currentBlock.attributes}
          blockIndex={currentBlock.index}
          blockType={currentBlock.type}
          curBlockY={currentBlock.rect.y}
          enableBold={enableBold}
          enableItalic={enableItalic}
          enableLink={enableLink}
          enableStrikethrough={enableStrikethrough}
          enableVariable={enableVariable}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          range={currentBlock.range}
        />
      )}
      <Box data-hello={'hello'} sx={{ position: 'relative' }}>
        {blockDividers.map((divider) => {
          return (
            draggingBlockIndex !== null &&
            divider.blockIndex !== draggingBlockIndex &&
            divider.blockIndex !== draggingBlockIndex - 1 && (
              <DropZone
                key={divider.blockIndex}
                index={divider.blockIndex}
                isDragging={draggingBlockIndex !== null}
                onDrop={handleDrop}
                onHover={handleDropTargetChanged}
                y={divider.y}
              />
            )
          );
        })}
      </Box>
      {showBlockInsert && (
        <BlockInsert blockDividers={blockDividers} mouseY={mousePosition.y} />
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
          {showBlockMenu && (
            <BlockMenu filteredBlocks={filteredBlocks} menu={menu} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default EditorOverlays;
