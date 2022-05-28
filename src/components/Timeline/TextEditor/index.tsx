import { isEqual } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { withHistory } from 'slate-history';
import { Box, Collapse } from '@material-ui/core';
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
import TextElement from './TextElement';
import theme from 'theme';
import Toolbar from './Toolbar';
import { ZetkinFileUploadChip } from 'components/ZetkinFileChip';
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
  placeholder: string;
}

const TextEditor: React.FunctionComponent<TextEditorProps> = ({
  clear,
  fileUploads,
  onChange,
  onCancelFile,
  placeholder,
}) => {
  const [active, setActive] = useState<boolean>(false);
  const classes = useStyles({ active });
  const renderElement = useCallback((props) => <TextElement {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
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
          onBlur={onBlur}
          onFocus={() => setActive(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
        />
        <Collapse in={active}>
          <Toolbar />
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
  );

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    keyDownHandler(editor, event);
  }

  function onBlur() {
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
