import { TextField } from '@mui/material';

import { useMessages } from 'core/i18n';
import messageIds from 'features/tasks/l10n/messageIds';

type Props = {
  defaultMessage?: string;
  onDefaultMessageChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  url?: string;
};

const ShareLinkFields = ({
  url,
  onUrlChange,
  defaultMessage,
  onDefaultMessageChange,
}: Props): JSX.Element => {
  const messages = useMessages(messageIds);

  return (
    <>
      <TextField
        fullWidth
        id="url"
        label={messages.configs.shareLink.fields.url()}
        margin="normal"
        onChange={(e) => onUrlChange(e.target.value)}
        required
        value={url ?? ''}
      />

      <TextField
        fullWidth
        id="default_message"
        label={messages.configs.shareLink.fields.defaultMessage()}
        margin="normal"
        onChange={(e) => onDefaultMessageChange(e.target.value)}
        required
        value={defaultMessage ?? ''}
      />
    </>
  );
};

export default ShareLinkFields;
