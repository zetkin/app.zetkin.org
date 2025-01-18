import { IconButton } from '@mui/material';
import { useActive, useCommands, useEditorState } from '@remirror/react';
import { FC, useEffect, useState } from 'react';
import { InsertLink, LinkOff } from '@mui/icons-material';

import { NodeWithPosition } from '../LinkExtensionUI';

const LinkToolButton: FC = () => {
  const active = useActive();
  const state = useEditorState();
  const { focus, insertEmptyLink, removeAllLinksInRange, removeLink, setLink } =
    useCommands();

  const [selectedNodes, setSelectedNodes] = useState<NodeWithPosition[]>([]);

  useEffect(() => {
    const linkNodes: NodeWithPosition[] = [];
    state.doc.nodesBetween(
      state.selection.from,
      state.selection.to,
      (node, index) => {
        if (node.isText) {
          if (node.marks.some((mark) => mark.type.name == 'zlink')) {
            linkNodes.push({ from: index, node, to: index + node.nodeSize });
          }
        }
      }
    );
    setSelectedNodes(linkNodes);
  }, [state.selection]);

  return (
    <IconButton
      onClick={() => {
        if (!active.zlink()) {
          if (state.selection.empty) {
            insertEmptyLink();
            focus();
          } else {
            setLink();
            focus();
          }
        } else {
          if (selectedNodes.length == 1) {
            removeLink({
              from: selectedNodes[0].from,
              to: selectedNodes[0].to,
            });
          } else if (selectedNodes.length > 1) {
            removeAllLinksInRange({
              from: state.selection.from,
              to: state.selection.to,
            });
          }
        }
      }}
    >
      {active.zlink() ? <LinkOff /> : <InsertLink />}
    </IconButton>
  );
};

export default LinkToolButton;
