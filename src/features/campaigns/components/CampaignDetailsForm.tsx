import { Form } from 'react-final-form';
import { MenuItem } from '@mui/material';
import { TextField } from 'mui-rff';
import { useState } from 'react';

import ZUISubmitCancelButtons from '../../../zui/ZUISubmitCancelButtons';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinCampaign, ZetkinPerson } from 'utils/types/zetkin';

import messageIds from '../l10n/messageIds';

interface CampaignDetailsFormProps {
  campaign?: ZetkinCampaign;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

const CampaignDetailsForm = ({
  onSubmit,
  onCancel,
  campaign,
}: CampaignDetailsFormProps): JSX.Element => {
  const messages = useMessages(messageIds);

  const [selectedManager] = useState<ZetkinPerson | null>(
    campaign?.manager
      ? ({
          first_name: campaign.manager.name.split(' ')[0],
          id: campaign.manager.id,
          last_name: campaign?.manager.name.split(' ')[1],
        } as ZetkinPerson)
      : null
  );

  const initialValues = {
    info_text: campaign?.info_text,
    status: campaign?.published ? 'published' : 'draft',
    title: campaign?.title,
    visibility: campaign?.visibility,
  };

  const validate = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};
    if (!values.title) {
      errors.title = messages.form.required();
    }
    return errors;
  };

  const handleSubmit = (values: Record<string, string>) => {
    const { info_text, status, title, visibility } = values;
    onSubmit({
      info_text: info_text ?? '',
      manager_id: selectedManager ? selectedManager.id : null,
      published: status !== 'draft',
      title: title,
      visibility,
    });
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={({ handleSubmit, submitting, valid }) => (
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="title"
            label={messages.form.name()}
            margin="normal"
            name="title"
            required
          />

          <TextField
            fullWidth
            id="info_text"
            label={messages.form.description()}
            margin="normal"
            multiline
            name="info_text"
            rows={5}
            variant="outlined"
          />

          <TextField
            fullWidth
            id="status"
            label={messages.form.status.heading()}
            margin="normal"
            name="status"
            select
          >
            <MenuItem value="published">
              <Msg id={messageIds.form.status.published} />
            </MenuItem>
            <MenuItem value="draft">
              <Msg id={messageIds.form.status.draft} />
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            id="visibility"
            label={messages.form.visibility.heading()}
            margin="normal"
            name="visibility"
            select
          >
            <MenuItem value="hidden">
              <Msg id={messageIds.form.visibility.private} />
            </MenuItem>
            <MenuItem value="open">
              <Msg id={messageIds.form.visibility.public} />
            </MenuItem>
          </TextField>

          <ZUISubmitCancelButtons
            onCancel={onCancel}
            submitDisabled={submitting || !valid}
          />
        </form>
      )}
      validate={validate}
    />
  );
};

export default CampaignDetailsForm;
