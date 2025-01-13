import { useEditorEvent, useEditorState, useEditorView } from '@remirror/react';
import { FC, useEffect, useState } from 'react';
import { findParentNode, isNodeSelection, ProsemirrorNode } from 'remirror';

import BlockToolbar from './BlockToolbar';
import BlockInsert from './BlockInsert';
import BlockMenu from './BlockMenu';

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

const Tools: FC<Props> = ({ blocks }) => {
  const view = useEditorView();
  const state = useEditorState();

  const [typing, setTyping] = useState(false);
  const [curBlockY, setCurBlockY] = useState<number>(-1);
  const [curBlockType, setCurBlockType] = useState<string>();
  const [mouseY, setMouseY] = useState(-Infinity);

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
      setCurBlockY(nodeRect.y - editorRect.y);
      setCurBlockType(node.type.name);
    }
  }, [state.selection]);

  //View.hasFocus() returnerar true om klick kommer från resten av sidan
  const showBlockToolbar =
    !!curBlockType && curBlockY >= 0 && view.hasFocus() && !typing;

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
    <>
      {showBlockToolbar && (
        <BlockToolbar
          curBlockType={curBlockType || ''}
          curBlockY={curBlockY}
          pos={state.selection.$anchor.pos}
        />
      )}
      <BlockInsert blockDividers={blockDividers} mouseY={mouseY} />
      <BlockMenu blocks={blocks} />
    </>
  );
};

export default Tools;
