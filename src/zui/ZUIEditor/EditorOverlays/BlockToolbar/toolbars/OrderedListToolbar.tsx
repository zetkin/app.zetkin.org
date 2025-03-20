import { FC } from 'react';
import { FromToProps } from 'remirror';
import { FormatListNumberedOutlined } from '@mui/icons-material';
import { useCommands } from '@remirror/react';
import { ButtonGroup } from '@mui/material';

import BlockToolbarBase from './BlockToolbarBase';
import messageIds from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';
import IndentButton from '../buttons/IndentButton';
import DedentButton from '../buttons/DedentButton';

type OrderedListToolbarProps = {
  range: FromToProps;
};

const OrderedListToolbar: FC<OrderedListToolbarProps> = ({ range }) => {
  const messages = useMessages(messageIds);
  const { toggleBulletList } = useCommands();
  return (
    <BlockToolbarBase
      conversions={[
        {
          label: messages.editor.toolbar.conversions.bulletList(),
          onClick: () => toggleBulletList(),
        },
      ]}
      icon={<FormatListNumberedOutlined />}
      range={range}
      title={messages.editor.blockLabels.orderedList()}
      tools={
        <ButtonGroup>
          <IndentButton />
          <DedentButton />
        </ButtonGroup>
      }
    />
  );
};

export default OrderedListToolbar;
