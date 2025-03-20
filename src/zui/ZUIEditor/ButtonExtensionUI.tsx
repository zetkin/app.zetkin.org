import { useCommands, useEditorState, useEditorView } from '@remirror/react';
import { FC, useEffect, useState } from 'react';
import { ProsemirrorNode } from 'remirror';

import TextAndHrefOverlay from './elements/TextAndHrefOverlay';
import formatUrl from 'utils/formatUrl';

const ButtonExtensionUI: FC = () => {
  const state = useEditorState();
  const view = useEditorView();
  const { setButtonHref, setButtonText } = useCommands();

  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [href, setHref] = useState('');

  const selectionCoords = view.coordsAtPos(state.selection.$from.pos);
  const editorRect = view.dom.getBoundingClientRect();

  const left = selectionCoords.left - editorRect.left;
  const top = selectionCoords.top - editorRect.top;

  useEffect(() => {
    const blockNodes: ProsemirrorNode[] = [];
    state.doc.nodesBetween(state.selection.from, state.selection.to, (node) => {
      if (!node.isText) {
        blockNodes.push(node);
      }
    });

    if (blockNodes.length == 1 && blockNodes[0].type.name == 'zbutton') {
      const buttonNode = blockNodes[0];
      setText(buttonNode.textContent || '');
      setHref(buttonNode.attrs.href || '');
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [state.selection]);

  return (
    <TextAndHrefOverlay
      href={href}
      onCancel={() => {
        setVisible(false);
      }}
      onChangeHref={(href) => setHref(href)}
      onChangeText={(text) => setText(text)}
      onSubmit={() => {
        const formattedHref = formatUrl(href);
        if (formattedHref) {
          setButtonText(state.selection.$head.pos, text);
          setButtonHref(state.selection.$head.pos, formattedHref);
        }
      }}
      open={visible}
      text={text}
      x={left}
      y={top + 30}
    />
  );
};

export default ButtonExtensionUI;
