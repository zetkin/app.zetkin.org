import { makeStyles } from '@mui/styles';
import React from 'react';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatStrikethrough,
} from '@mui/icons-material';

import {
  AddAttachmentButton,
  AddLinkButton,
  BlockButton,
  MarkButton,
  RemoveLinkButton,
} from './toolbarButtons';

const useStyles = makeStyles({
  container: {
    '& button': {
      padding: 6,
    },
    marginTop: 12,
  },
});

const Toolbar: React.FunctionComponent<{ onClickAttach?: () => void }> = ({
  onClickAttach,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <MarkButton format="bold" MarkIcon={FormatBold} />
      <MarkButton format="italic" MarkIcon={FormatItalic} />
      <MarkButton format="strikeThrough" MarkIcon={FormatStrikethrough} />
      <RemoveLinkButton />
      <AddLinkButton />
      <BlockButton BlockIcon={FormatQuote} format="block-quote" />
      <BlockButton BlockIcon={FormatListBulleted} format="bulleted-list" />
      <BlockButton BlockIcon={FormatListNumbered} format="numbered-list" />
      {!!onClickAttach && <AddAttachmentButton onClick={onClickAttach} />}
    </div>
  );
};

export default Toolbar;
