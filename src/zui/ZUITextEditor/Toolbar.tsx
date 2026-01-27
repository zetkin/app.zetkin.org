import React from 'react';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatStrikethrough,
} from '@mui/icons-material';
import { Box } from '@mui/system';

import {
  AddAttachmentButton,
  AddLinkButton,
  BlockButton,
  MarkButton,
  RemoveLinkButton,
} from './toolbarButtons';

const Toolbar: React.FunctionComponent<{ onClickAttach?: () => void }> = ({
  onClickAttach,
}) => {
  return (
    <Box
      sx={{
        '& button': {
          padding: '6px',
        },
        marginTop: '12px',
      }}
    >
      <MarkButton format="bold" MarkIcon={FormatBold} />
      <MarkButton format="italic" MarkIcon={FormatItalic} />
      <MarkButton format="strikeThrough" MarkIcon={FormatStrikethrough} />
      <RemoveLinkButton />
      <AddLinkButton />
      <BlockButton BlockIcon={FormatQuote} format="block-quote" />
      <BlockButton BlockIcon={FormatListBulleted} format="bulleted-list" />
      <BlockButton BlockIcon={FormatListNumbered} format="numbered-list" />
      {!!onClickAttach && <AddAttachmentButton onClick={onClickAttach} />}
    </Box>
  );
};

export default Toolbar;
