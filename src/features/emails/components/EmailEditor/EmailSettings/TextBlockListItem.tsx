import { FC } from 'react';

import BlockListItemBase from './BlockListItemBase';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

export interface TextBlockData {
  text: string;
}

interface TextBlockListItemProps {
  data: TextBlockData;
  hasErrors: boolean;
  readOnly: boolean;
  selected: boolean;
}

const TextBlockListItem: FC<TextBlockListItemProps> = ({
  data,
  hasErrors,
  readOnly,
  selected,
}) => {
  const messages = useMessages(messageIds);

  return (
    <BlockListItemBase
      excerpt={data.text}
      hasErrors={hasErrors}
      selected={selected}
      title={messages.editor.tools.paragraph.title()}
    >
      {!readOnly && hasErrors && (
        <Msg id={messageIds.editor.tools.paragraph.invalidUrls} />
      )}
    </BlockListItemBase>
  );
};

export default TextBlockListItem;
