import { FC } from 'react';

import BlockListItemBase from './BlockListItemBase';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';

export interface HeaderBlockData {
  text: string;
}

interface HeaderBlockListItemProps {
  data: HeaderBlockData;
  selected: boolean;
}

const HeaderBlockListItem: FC<HeaderBlockListItemProps> = ({
  data,
  selected,
}) => {
  const messages = useMessages(messageIds);

  return (
    <BlockListItemBase
      excerpt={data.text}
      hasErrors={false}
      selected={selected}
      title={messages.editor.tools.header.title()}
    />
  );
};

export default HeaderBlockListItem;
