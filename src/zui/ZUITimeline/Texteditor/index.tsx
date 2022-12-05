import { isEqual } from 'lodash';
import { makeStyles } from '@mui/styles';
import { withHistory } from 'slate-history';
import { Box, ClickAwayListener, Collapse } from '@mui/material';
import { createEditor, Descendant, Editor, Transforms } from 'slate';
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import './types';
import { FileUpload } from 'features/files/hooks/useFileUploads';
import TextElement from './TextElement';
import theme from 'theme';
import Toolbar from './Toolbar';
import { ZetkinFileUploadChip } from 'zui/ZUIFileChip';
import { keyDownHandler, slateToMarkdown, withInlines } from './helpers';

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

interface TextEditorProps {
  clear: number;
  fileUploads: FileUpload[];
  onChange: (value: string) => void;
  onCancelFile?: (file: FileUpload) => void;
  onClickAttach?: () => void;
  placeholder: string;
}

const TextEditor: React.FunctionComponent<TextEditorProps> = ({
  clear,
  fileUploads,
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
  const initialValue = [
    {
      children: [{ text: '' }],
      type: 'paragraph',
    },
  ] as Descendant[];

  useEffect(() => {
    if (clear > 0) {
      clearEditor();
      setActive(false);
    }
  }, [clear]);

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box
        className={classes.container}
        onClick={() => ReactEditor.focus(editor)}
      >
        <Slate
          editor={editor}
          onChange={(slateArray) => onChange(slateToMarkdown(slateArray))}
          value={initialValue}
        >
          <Editable
            onFocus={() => setActive(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck
          />
          <Collapse in={active}>
            <Toolbar onClickAttach={onClickAttach} />
          </Collapse>
        </Slate>
        {fileUploads.map((fileUpload) => {
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
    if (isEqual(editor.children, initialValue)) {
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
    Transforms.insertNodes(editor, initialValue);
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

export default TextEditor;
