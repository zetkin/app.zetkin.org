/* eslint-disable jsx-a11y/no-autofocus */
import { isEqual } from 'lodash';
import { makeStyles } from '@mui/styles';
import { withHistory } from 'slate-history';
import { Box, ClickAwayListener, Collapse } from '@mui/material';
import {
  createEditor,
  deleteBackward,
  Descendant,
  Editor,
  Node,
  Transforms,
} from 'slate';
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { markdownToSlate } from './utils/markdownToSlate';
import './types';
import { FileUpload } from 'features/files/hooks/useFileUploads';
import TextElement from './TextElement';
import theme from 'theme';
import Toolbar from './Toolbar';
import { ZetkinFileUploadChip } from 'zui/ZUIFileChip';
import {
  keyDownHandler,
  shouldBeRemoved,
  slateToMarkdown,
  withInlines,
} from './helpers';

const emptySlate = [
  {
    children: [{ text: '' }],
    type: 'paragraph',
  },
] as Descendant[];

const useStyles = makeStyles({
  container: {
    '& a': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
    '&:hover': {
      borderColor: theme.palette.onSurface.medium,
    },
    background: (props: { active: boolean }) =>
      props.active ? 'white' : 'transparent',
    border: '1.5px solid',
    borderColor: (props: { active: boolean }) =>
      props.active
        ? theme.palette.onSurface.medium
        : theme.palette.outline.main,
    borderRadius: 8,
    fontFamily: 'system-ui',
    padding: 16,
    transition: 'all 0.3s ease',
  },
});

export interface ZUITextEditorProps {
  clear?: number;
  fileUploads?: FileUpload[];
  initialValue?: string;
  onChange: (value: string) => void;
  onCancelFile?: (file: FileUpload) => void;
  onClickAttach?: () => void;
  placeholder: string;
}

const ZUITextEditor: React.FunctionComponent<ZUITextEditorProps> = ({
  clear,
  fileUploads,
  initialValue,
  onChange,
  onCancelFile,
  onClickAttach,
  placeholder,
}) => {
  const [active, setActive] = useState<boolean>(false);
  const classes = useStyles({ active });
  const renderElement = useCallback(
    (props: RenderElementProps) => <TextElement {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    []
  );

  //fixes deleting the missing bullet point in empty list in root
  editor.deleteBackward = (...args) => {
    deleteBackward(editor, ...args);

    const bulletListNode = Editor.above(editor, {
      match: (n: Node) =>
        'type' in n &&
        n.type === 'list-item' &&
        Object.prototype.hasOwnProperty.call(n, 'children'),
    });

    if (bulletListNode) {
      if (shouldBeRemoved(bulletListNode)) {
        Transforms.setNodes(
          editor,
          { type: 'paragraph' },
          {
            at: bulletListNode[1],
            match: (n) => 'type' in n && n.type === 'list-item',
          }
        );
      }
    }
    return editor;
  };

  const markdownValue = useRef('');
  const [initialValueSlate, setInitialValueSlate] = useState<
    Descendant[] | null
  >(null);

  useEffect(() => {
    (async () => {
      if (initialValue) {
        if (initialValue !== markdownValue.current) {
          const slate = await markdownToSlate(initialValue);
          setInitialValueSlate(slate as Descendant[]);
        }
      } else {
        setInitialValueSlate(emptySlate);
      }
    })();
  }, [initialValue]);

  useEffect(() => {
    if (clear && clear > 0) {
      clearEditor();
      setActive(false);
    }
  }, [clear]);

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box
        className={classes.container}
        onClick={() => ReactEditor.focus(editor)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        {/* Only render when slate has been generated */}
        {initialValueSlate && (
          <Slate
            editor={editor}
            initialValue={initialValueSlate}
            onChange={(slateArray) => {
              markdownValue.current = slateToMarkdown(slateArray);
              onChange(markdownValue.current);
            }}
          >
            <Editable
              autoFocus
              onFocus={() => setActive(true)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              spellCheck
              style={{
                outline: 'none',
                overflowY: 'scroll',
              }}
            />
            <Collapse in={active} sx={{ flexShrink: 0 }}>
              <Toolbar onClickAttach={onClickAttach} />
            </Collapse>
          </Slate>
        )}
        {fileUploads &&
          fileUploads.map((fileUpload) => {
            return (
              <ZetkinFileUploadChip
                key={fileUpload.key}
                fileUpload={fileUpload}
                onDelete={() => {
                  if (onCancelFile) {
                    onCancelFile(fileUpload);
                  }
                }}
              />
            );
          })}
      </Box>
    </ClickAwayListener>
  );

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    keyDownHandler(editor, event);
  }

  function onClickAway() {
    if (isEqual(editor.children, emptySlate)) {
      setActive(false);
      clearEditor();
    }
  }

  function clearEditor() {
    Transforms.select(editor, {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    });
    Transforms.removeNodes(editor);
    Transforms.insertNodes(editor, emptySlate);
  }
};

export const Leaf: React.FunctionComponent<RenderLeafProps> = ({
  attributes,
  children,
  leaf,
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.strikeThrough) {
    children = <s>{children}</s>;
  }

  return <span {...attributes}>{children}</span>;
};

export default ZUITextEditor;
