import {
  useCommands,
  useEditorState,
  useEditorView,
  useExtensionEvent,
} from '@remirror/react';
import {
  FC,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { ProsemirrorNode } from 'remirror';
import { Box, Button, Paper, Popper, TextField } from '@mui/material';

import FileLibraryDialog from 'features/files/components/FileLibraryDialog';
import ImageExtension from './extensions/ImageExtension';
import Msg from 'core/i18n/Msg';
import messageIds from 'zui/l10n/messageIds';
import useMessages from 'core/i18n/useMessages';

type Props = {
  orgId: number;
};

const AltTextEditor: FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const messages = useMessages(messageIds);
  const state = useEditorState();
  const view = useEditorView();
  const { setImageAlt } = useCommands();

  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  const selectionCoords = useMemo(
    () => view.coordsAtPos(state.selection.$to.pos),
    [view, state.selection.$to.pos]
  );

  const editorRect = view.dom.getBoundingClientRect();

  const left = (editorRect.right - editorRect.left) / 2;
  const bottom = selectionCoords.top - editorRect.top;

  const selectedBlock = useMemo(() => {
    const blockNodes: ProsemirrorNode[] = [];
    state.doc.nodesBetween(state.selection.from, state.selection.to, (node) => {
      if (!node.isText) {
        blockNodes.push(node);
      }
    });

    return (
      blockNodes.length == 1 &&
      blockNodes[0].type.name == 'zimage' &&
      blockNodes[0]
    );
  }, [state.doc, state.selection.from, state.selection.to]);

  useLayoutEffect(() => {
    if (selectedBlock) {
      const node = state.doc.nodeAt(state.selection.from);
      if (node?.type.name === 'zimage') {
        setText(node.attrs.alt || '');
      }
    }
  }, [selectedBlock, state]);

  useEffect(() => {
    setVisible(!!selectedBlock);
  }, [selectedBlock]);

  const isFocused = view.hasFocus();

  useEffect(() => {
    if (isFocused) {
      return;
    }

    startTransition(() => {
      setVisible(isFocused);
    });
  }, [isFocused]);

  const onSubmit = useCallback(() => {
    setImageAlt(state.selection.from, text);
    setVisible(false);
  }, [setImageAlt, state.selection.from, text]);

  const onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const onChange = useCallback((str: string) => {
    setText(str);
  }, []);

  return (
    <Box position="relative">
      <Box
        ref={(el: HTMLElement) => setAnchorEl(el)}
        sx={{
          left: left,
          position: 'absolute',
          top: bottom - 80,
        }}
      >
        <Popper
          anchorEl={anchorEl}
          disablePortal
          open={!!selectedBlock && visible}
          placement="bottom"
          sx={{ zIndex: 2 }}
        >
          <Paper elevation={1}>
            <Box
              alignItems="stretch"
              display="flex"
              flexDirection="column"
              gap={1}
              padding={1}
              sx={{ minWidth: 350 }}
            >
              <Box display="flex">
                <TextField
                  fullWidth
                  label={messages.editor.extensions.image.altText()}
                  multiline
                  onChange={(ev) => onChange(ev.target.value)}
                  onKeyUp={(ev) => {
                    if (ev.key == 'Enter') {
                      onSubmit();
                    }
                  }}
                  rows={4}
                  size="small"
                  value={text}
                />
              </Box>
              <Box display="flex" justifyContent={'flex-end'}>
                <Box display="flex" gap={1}>
                  <Button
                    onClick={() => {
                      onCancel();
                    }}
                    size="small"
                  >
                    <Msg id={messageIds.editor.extensions.image.cancel} />
                  </Button>

                  <Button
                    onClick={() => {
                      onSubmit();
                    }}
                    size="small"
                    variant="outlined"
                  >
                    <Msg id={messageIds.editor.extensions.image.apply} />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Popper>
      </Box>
    </Box>
  );
};

const FileLibrary: FC<Props> = ({ orgId }) => {
  const [pos, setPos] = useState<number | null>(null);
  const { setImageFile } = useCommands();

  useExtensionEvent(ImageExtension, 'onCreate', (pos) => {
    setPos(pos);
  });

  useExtensionEvent(ImageExtension, 'onPick', (newPos) => {
    setPos(newPos);
  });

  return (
    <FileLibraryDialog
      onClose={() => {
        setPos(null);
      }}
      onSelectFile={(file) => {
        if (pos) {
          setImageFile(file, pos);
          setPos(null);
        }
      }}
      open={!!pos}
      orgId={orgId}
    />
  );
};

export default function ImageExtensionUI(props: Props) {
  return (
    <>
      <FileLibrary {...props} />
      <AltTextEditor />
    </>
  );
}
