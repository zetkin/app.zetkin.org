import { TextField } from 'mui-rff';
import { useIntl } from 'react-intl';

import { SHARE_LINK_FIELDS } from '../constants';

const ShareLinkFields = (): JSX.Element => {
  const intl = useIntl();
  return (
    <>
      <TextField
        fullWidth
        id="url"
        label={intl.formatMessage({
          id: 'misc.tasks.forms.shareLinkConfig.fields.url',
        })}
        margin="normal"
        name={SHARE_LINK_FIELDS.URL}
        required
      />

      <TextField
        fullWidth
        id="default_message"
        label={intl.formatMessage({
          id: 'misc.tasks.forms.shareLinkConfig.fields.default_message',
        })}
        margin="normal"
        name={SHARE_LINK_FIELDS.DEFAULT_MESSAGE}
        required
      />
    </>
  );
};

export default ShareLinkFields;
