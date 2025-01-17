import { useCommands, useEditorState, useEditorView } from '@remirror/react';
import { FC, useEffect, useState } from 'react';
import { ProsemirrorNode } from 'remirror';

import formatUrl from 'utils/formatUrl';
import TextAndHrefOverlay from './elements/TextAndHrefOverlay';

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
      const currentText = selectedNode.text;

      const textWithoutPlaceholder = currentText?.replaceAll(
        String.fromCharCode(160),
        ''
      );

      setLinkText(textWithoutPlaceholder || '');
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
    <TextAndHrefOverlay
      href={linkHref}
      onCancel={() => {
        setSelectedNodes([]);
      }}
      onChangeHref={(href) => setLinkHref(href)}
      onChangeText={(text) => setLinkText(text)}
      onRemove={() => {
        removeLink({
          from: selectedNodes[0].from,
          to: selectedNodes[0].to,
        });
      }}
      onSubmit={() => {
        updateLink({ href: formattedHref || '' });
        updateLinkText(
          {
            from: selectedNodes[0].from,
            to: selectedNodes[0].to,
          },
          linkText
        );
      }}
      open={showLinkMaker}
      text={linkText}
      x={left}
      y={top + 20}
    />
  );
};

export default LinkExtensionUI;
