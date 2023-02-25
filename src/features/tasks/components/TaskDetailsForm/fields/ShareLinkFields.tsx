import { TextField } from 'mui-rff';

import { SHARE_LINK_FIELDS } from '../constants';
import { useMessages } from 'core/i18n';

import messageIds from 'features/tasks/l10n/messageIds';

const ShareLinkFields = (): JSX.Element => {
  const messages = useMessages(messageIds);

  return (
    <>
      <TextField
        fullWidth
        id="url"
        label={messages.configs.shareLink.fields.url()}
        margin="normal"
        name={SHARE_LINK_FIELDS.URL}
        required
      />

      <TextField
        fullWidth
        id="default_message"
        label={messages.configs.shareLink.fields.defaultMessage()}
        margin="normal"
        name={SHARE_LINK_FIELDS.DEFAULT_MESSAGE}
        required
      />
    </>
  );
};

export default ShareLinkFields;
