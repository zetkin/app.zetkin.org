/* eslint-disable jsx-a11y/no-autofocus */
import { isEqual } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { withHistory } from 'slate-history';
import { Box, ClickAwayListener, Collapse } from '@material-ui/core';
import { createEditor, Descendant, Editor, Transforms } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import React, {
  Attributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import './types';
import { FileUpload } from 'hooks/useFileUploads';
import { markdownToSlate } from './utils/markdownToSlate';
import TextElement from './TextElement';
import theme from 'theme';
import Toolbar from './Toolbar';
import { ZetkinFileUploadChip } from 'components/ZetkinFileChip';
import { keyDownHandler, slateToMarkdown, withInlines } from './helpers';

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

export interface TextEditorProps {
  clear: number;
  fileUploads: FileUpload[];
  initialValue?: string;
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
  initialValue,
}) => {
  const [active, setActive] = useState<boolean>(false);
  const classes = useStyles({ active });
  const renderElement = useCallback((props) => <TextElement {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    []
  );
  const [initialValueSlate, setInitialValueSlate] = useState<
    Descendant[] | null
  >(null);

  useEffect(() => {
    (async () => {
      if (initialValue) {
        const slate = await markdownToSlate(initialValue as string);
        setInitialValueSlate(slate as Descendant[]);
      } else {
        setInitialValueSlate(emptySlate);
      }
    })();
  }, [initialValue]);

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
        {/* Only render when slate has been generated */}
        {initialValueSlate && (
          <Slate
            editor={editor}
            onChange={(slateArray) => onChange(slateToMarkdown(slateArray))}
            value={initialValueSlate}
          >
            <Editable
              autoFocus
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
        )}

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

export const Leaf: React.FunctionComponent<{
  attributes: Attributes;
  leaf: { [key: string]: boolean };
}> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.strikeThrough || leaf.strikethrough) {
    children = <s>{children}</s>;
  }

  return <span {...attributes}>{children}</span>;
};

export default TextEditor;
