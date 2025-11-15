import { TextField } from '@mui/material';

import { useMessages } from 'core/i18n';
import messageIds from 'features/tasks/l10n/messageIds';

type Props = {
  onUrlChange: (value: string) => void;
  url?: string;
};

const VisitLinkFields = ({ url, onUrlChange }: Props): JSX.Element => {
  const messages = useMessages(messageIds);

  return (
    <TextField
      fullWidth
      id="url"
      label={messages.configs.visitLink.fields.url()}
      margin="normal"
      onChange={(e) => onUrlChange(e.target.value)}
      required
      value={url ?? ''}
    />
  );
};

export default VisitLinkFields;
