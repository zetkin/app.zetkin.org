import { useSlate } from 'slate-react';
import { Attachment, Link, LinkOff } from '@material-ui/icons';
import { IconButton, IconButtonProps } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

import {
  insertLink,
  isBlockActive,
  isLinkActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
  unwrapLink,
} from './helpers';

export const BlockButton: React.FunctionComponent<{
  BlockIcon: FunctionComponent;
  format: string;
}> = ({ BlockIcon, format }) => {
  const editor = useSlate();
  return (
    <IconButton
      color={isBlockActive(editor, format) ? 'primary' : 'default'}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <BlockIcon />
    </IconButton>
  );
};

export const MarkButton: React.FunctionComponent<{
  MarkIcon: FunctionComponent;
  format: string;
  iconButtonProps?: IconButtonProps;
}> = ({ format, iconButtonProps, MarkIcon }) => {
  const editor = useSlate();
  return (
    <IconButton
      color={isMarkActive(editor, format) ? 'primary' : 'default'}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      {...iconButtonProps}
    >
      <MarkIcon />
    </IconButton>
  );
};

export const AddLinkButton: React.FunctionComponent = () => {
  const editor = useSlate();
  return (
    <IconButton
      color={isLinkActive(editor) ? 'primary' : 'default'}
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt('Enter the URL of the link:');
        if (!url) {
          return;
        }
        insertLink(editor, url);
      }}
    >
      <Link />
    </IconButton>
  );
};

export const RemoveLinkButton: React.FunctionComponent = () => {
  const editor = useSlate();

  return (
    <IconButton
      color={isLinkActive(editor) ? 'primary' : 'default'}
      onMouseDown={() => {
        if (isLinkActive(editor)) {
          unwrapLink(editor);
        }
      }}
    >
      <LinkOff />
    </IconButton>
  );
};

export const AddAttachmentButton: React.FunctionComponent = () => {
  return (
    <IconButton disabled onMouseDown={() => null}>
      <Attachment />
    </IconButton>
  );
};
