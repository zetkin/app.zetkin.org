import { makeStyles } from '@material-ui/styles';
import { withHistory } from 'slate-history';
import { Box, Collapse } from '@material-ui/core';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import React, { Attributes, useCallback, useMemo, useState } from 'react';

import './types';
import TextElement from './TextElement';
import theme from 'theme';
import Toolbar from './Toolbar';
import { keyDownHandler, withInlines } from './helpers';

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
  initialValue?: Descendant[];
  onChange: (value: Descendant[]) => void;
  placeholder: string;
}

const TextEditor: React.FunctionComponent<TextEditorProps> = ({
  initialValue,
  onChange,
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

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    keyDownHandler(editor, event);
  };

  return (
    <Box className={classes.container}>
      <Slate editor={editor} onChange={onChange} value={initialValue || []}>
        <Editable
          onBlur={() => setActive(false)}
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
    </Box>
  );
};

const Leaf: React.FunctionComponent<{
  attributes: Attributes;
  leaf: { [key: string]: boolean };
}> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }

  return <span {...attributes}>{children}</span>;
};

export default TextEditor;
