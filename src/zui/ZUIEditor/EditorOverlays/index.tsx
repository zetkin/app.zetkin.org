import {
  useEditorEvent,
  useEditorState,
  useEditorView,
  usePositioner,
} from '@remirror/react';
import { FC, useCallback, useEffect, useState } from 'react';
import { ProsemirrorNode } from '@remirror/pm/suggest';
import { Box, lighten, Typography, useTheme } from '@mui/material';
import { FromToProps, isNodeSelection } from 'remirror';
import { ErrorOutline } from '@mui/icons-material';
import { Attrs } from '@remirror/pm/model';

import BlockToolbar from './BlockToolbar/index';
import BlockInsert from './BlockInsert';
import BlockMenu from './BlockMenu';
import useBlockMenu from './useBlockMenu';
import { BlockProblem, EmailContentBlock } from 'features/emails/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import { RemirrorBlockType } from '../types';
import editorBlockProblems from '../utils/editorBlockProblems';

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
  onSelectBlock: (selectedBlockIndex: number) => void;
  zetkinContent: EmailContentBlock[];
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
  zetkinContent,
}) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const view = useEditorView();
  const state = useEditorState();
  const positioner = usePositioner('cursor');
  const { isOpen: showBlockMenu } = useBlockMenu(blocks);

  const [typing, setTyping] = useState(false);
  const [mouseY, setMouseY] = useState(-Infinity);
  const [currentBlock, setCurrentBlock] = useState<BlockData | null>(null);

  const editorRect = view.dom.getBoundingClientRect();

  let zetkinIndex = 0;
  const problems: (BlockProblem[] | null)[] = [];
  state.doc.children.forEach((node) => {
    if (
      node.type.name == RemirrorBlockType.PARAGRAPH &&
      node.content.size == 0
    ) {
      problems.push(null);
    } else {
      if (zetkinIndex < zetkinContent.length) {
        const zetkinBlock = zetkinContent[zetkinIndex];
        const blockProblems = editorBlockProblems(
          zetkinBlock,
          messages.editor.extensions.button.defaultText()
        );
        problems.push(blockProblems.length > 0 ? blockProblems : null);
        zetkinIndex++;
      }
    }
  });

  const allBlockRects: Record<string, DOMRect> = {};
  state.doc.descendants((node, pos, parent, index) => {
    const elem = view.nodeDOM(pos);
    if (elem instanceof HTMLElement) {
      const nodeRect = elem.getBoundingClientRect();
      const x = nodeRect.x - editorRect.x;
      const y = nodeRect.y - editorRect.y;

      const rect = {
        ...nodeRect.toJSON(),
        left: x,
        top: y,
        x: x,
        y: y,
      };
      allBlockRects[index] = rect;
    }
  });

  state.doc.descendants((node, pos, parent, index) => {
    const elem = view.nodeDOM(pos);
    if (elem instanceof HTMLElement) {
      const nodeRect = elem.getBoundingClientRect();
      const x = nodeRect.x - editorRect.x;
      const y = nodeRect.y - editorRect.y;

      const rect = {
        ...nodeRect.toJSON(),
        left: x,
        top: y,
        x: x,
        y: y,
      };
      allBlockRects[index] = rect;
    }
  });

  const findSelectedNode = useCallback(() => {
    if (isNodeSelection(state.selection)) {
      const selection = state.selection;
      const index = selection.$anchor.index(0);
      onSelectBlock(index);
      const posBefore = selection.$anchor.before(1);
      const posAfter = selection.$head.after(1);
      const elem = view.nodeDOM(posBefore);
      if (elem instanceof HTMLElement) {
        setCurrentBlock({
          attributes: selection.node.attrs,
          node: selection.node,
          range: {
            from: posBefore,
            to: posAfter,
          },
          rect: allBlockRects[index],
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
          const index = resolved.index(0);
          onSelectBlock(index);
          setCurrentBlock({
            attributes: node.attrs,
            node,
            range: {
              from: posBeforeTextContent,
              to: posAfterTextContent,
            },
            rect: allBlockRects[index],
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
      {problems.map((blockProblems, index) => {
        if (!blockProblems) {
          return null;
        }
        const rect = allBlockRects[index];
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
