import { TextField } from 'mui-rff';

import { useMessages } from 'core/i18n';
import { VISIT_LINK_FIELDS } from '../constants';

import messageIds from 'features/tasks/l10n/messageIds';

const VisitLinkFields = (): JSX.Element => {
  const messages = useMessages(messageIds);

  return (
    <TextField
      fullWidth
      id="url"
      label={messages.configs.visitLink.fields.url()}
      margin="normal"
      name={VISIT_LINK_FIELDS.URL}
      required
    />
  );
};

export default VisitLinkFields;
