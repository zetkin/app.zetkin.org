import {
  useEditorEvent,
  useEditorState,
  useEditorView,
  usePositioner,
} from '@remirror/react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ProsemirrorNode } from '@remirror/pm/suggest';
import { Box, lighten, Typography, useTheme } from '@mui/material';
import { FromToProps, isNodeSelection, RemirrorJSON } from 'remirror';
import { ErrorOutline } from '@mui/icons-material';
import { Attrs } from '@remirror/pm/model';

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
import { remirrorToZetkinWithIndexRemap } from 'features/emails/utils/conversion/remirrorToZetkin';

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
  content: RemirrorJSON[];
  editable: boolean;
  enableBold: boolean;
  enableItalic: boolean;
  enableLink: boolean;
  enableVariable: boolean;
  focused: boolean;
  onSelectBlock: (selectedBlockIndex: number) => void;
};

const EditorOverlays: FC<Props> = ({
  blocks,
  editable,
  enableBold,
  enableItalic,
  enableLink,
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

  const [allBlockRects, setAllBlockRects] = useState<Record<string, DOMRect>>(
    {}
  );

  const calculateAllBlockRects = useCallback(() => {
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

    return rects;
  }, [editorRect.x, editorRect.y, state.doc, view]);

  useEffect(() => {
    setAllBlockRects(calculateAllBlockRects());
  }, [calculateAllBlockRects]);

  const onSelectRemirrorBlock = useCallback(
    (blockIndex: number) => {
      const [, remap] = remirrorToZetkinWithIndexRemap(
        state.doc.content.toJSON()
      );
      const zetkinBlockIndex = remap[blockIndex];
      onSelectBlock(zetkinBlockIndex);
    },
    [onSelectBlock, state.doc.content]
  );

  const findSelectedNode = useCallback(() => {
    const allBlockRects = calculateAllBlockRects();

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
      } else if (state.doc.childCount > 0) {
        node = state.doc.child(index);
      }
    }

    if (!node) {
      return;
    }

    const elem = view.nodeDOM(posBefore);
    if (elem instanceof HTMLElement) {
      onSelectRemirrorBlock(index);
      setCurrentBlock({
        attributes: node.attrs,
        node: node,
        range: {
          from: posBefore,
          to: posAfter,
        },
        rect: allBlockRects[index],
        type: node.type.name as BlockType,
      });
    }
  }, [
    calculateAllBlockRects,
    state.selection,
    state.doc,
    onSelectRemirrorBlock,
    view,
  ]);

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
    const dividers: BlockDividerData[] = [{ pos: 0, y: 8 }];

    state.doc.descendants((node, pos) => {
      const elem = view.nodeDOM(pos);
      if (
        elem instanceof HTMLElement &&
        !(node.type.name === 'paragraph' && node.content.size === 0)
      ) {
        const rect = elem.getBoundingClientRect();
        dividers.push({
          pos: pos + node.nodeSize,
          y: rect.bottom - containerRect.top,
        });
      }
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

  return (
    <>
      {problems.map((blockProblems, index) => {
        if (!blockProblems) {
          return null;
        }
        const rect = allBlockRects[index];
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
