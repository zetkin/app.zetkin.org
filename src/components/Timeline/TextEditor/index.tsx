import { makeStyles } from '@material-ui/styles';
import { Property } from 'csstype';
import { withHistory } from 'slate-history';
import { Box, Collapse } from '@material-ui/core';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import React, { Attributes, useCallback, useMemo, useState } from 'react';

import './types';
import LinkComponent from './LinkComponent';
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
    background: 'white',
    border: '1.5px solid',
    borderColor: (props: { active: boolean }) =>
      props.active
        ? theme.palette.onSurface.medium
        : theme.palette.outline.main,
    borderRadius: 8,
    fontFamily: 'system-ui',
    padding: 16,
    transition: 'border-color 0.3s ease',
  },
});

const TextEditor: React.FunctionComponent<{ initialValue?: Descendant[] }> = ({
  initialValue,
}) => {
  const [active, setActive] = useState<boolean>(false);
  const classes = useStyles({ active });
  const renderElement = useCallback((props) => <Element {...props} />, []);
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
      <Slate editor={editor} value={initialValue || []}>
        <Editable
          onBlur={() => setActive(false)}
          onFocus={() => setActive(true)}
          onKeyDown={onKeyDown}
          placeholder="Enter some rich text…"
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

const Element: React.FunctionComponent<{
  attributes: Attributes;
  element: { align: Property.TextAlign; [key: string]: string };
}> = ({ attributes, children, element }) => {
  const style = {
    margin: '0 0 12px 0',
    textAlign: element.align,
  };
  // eslint-disable-next-line no-switch-statements/no-switch
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'link':
      return <LinkComponent {...{ attributes, children, element }} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
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
