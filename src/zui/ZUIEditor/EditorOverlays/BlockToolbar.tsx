import { Box, Button, Paper } from '@mui/material';
import { useActive, useCommands, useEditorState } from '@remirror/react';
import { FC, useEffect, useState } from 'react';

import { NodeWithPosition } from '../LinkExtensionUI';
import VariableToolButton from './VariableToolButton';
import { VariableName } from '../extensions/VariableExtension';

type BlockToolbarProps = {
  curBlockType: string;
  curBlockY: number;
  enableVariable: boolean;
  pos: number;
};

const BlockToolbar: FC<BlockToolbarProps> = ({
  curBlockType,
  curBlockY,
  enableVariable,
  pos,
}) => {
  const active = useActive();
  const state = useEditorState();
  const {
    convertParagraph,
    focus,
    insertEmptyLink,
    insertVariable,
    toggleHeading,
    pickImage,
    removeLink,
    removeAllLinksInRange,
    setLink,
  } = useCommands();

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
    <Box position="relative">
      <Box
        sx={{
          left: 0,
          position: 'absolute',
          top: curBlockY - 50,
          transition: 'opacity 0.5s',
          zIndex: 10000,
        }}
      >
        <Paper elevation={1}>
          <Box alignItems="center" display="flex" padding={1}>
            {curBlockType}
            {curBlockType == 'zimage' && (
              <Button
                onClick={() => {
                  pickImage(pos);
                }}
              >
                Change image
              </Button>
            )}
            {curBlockType == 'heading' && (
              <Button onClick={() => convertParagraph()}>
                Convert to paragraph
              </Button>
            )}
            {curBlockType == 'paragraph' && (
              <>
                <Button onClick={() => toggleHeading()}>
                  Convert to heading
                </Button>
                <Button
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
                  Link
                </Button>
              </>
            )}
            {enableVariable &&
              (curBlockType == 'paragraph' || curBlockType == 'heading') && (
                <VariableToolButton
                  onSelect={(varName: VariableName) => {
                    insertVariable(varName);
                    focus();
                  }}
                />
              )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BlockToolbar;
