import { MenuItem, TextField } from '@mui/material';
import { FormEvent, useState } from 'react';

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

  const [title, setTitle] = useState<string>(campaign?.title ?? '');
  const [infoText, setInfoText] = useState<string>(campaign?.info_text ?? '');
  const [status, setStatus] = useState<'published' | 'draft'>(
    campaign?.published ? 'published' : 'draft'
  );
  const [visibility, setVisibility] = useState<'hidden' | 'open'>(
    (campaign?.visibility as 'hidden' | 'open') ?? 'hidden'
  );

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    onSubmit({
      info_text: infoText ?? '',
      manager_id: selectedManager ? selectedManager.id : null,
      published: status !== 'draft',
      title: title,
      visibility,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        id="title"
        label={messages.form.name()}
        margin="normal"
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        required
        value={title}
      />

      <TextField
        fullWidth
        id="info_text"
        label={messages.form.description()}
        margin="normal"
        multiline
        name="info_text"
        onChange={(e) => setInfoText(e.target.value)}
        rows={5}
        value={infoText}
        variant="outlined"
      />

      <TextField
        fullWidth
        label={messages.form.status.heading()}
        margin="normal"
        onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
        select
        value={status}
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
        label={messages.form.visibility.heading()}
        margin="normal"
        onChange={(e) => setVisibility(e.target.value as 'hidden' | 'open')}
        select
        value={visibility}
      >
        <MenuItem value="hidden">
          <Msg id={messageIds.form.visibility.private} />
        </MenuItem>
        <MenuItem value="open">
          <Msg id={messageIds.form.visibility.public} />
        </MenuItem>
      </TextField>

      <ZUISubmitCancelButtons onCancel={onCancel} />
    </form>
  );
};

export default CampaignDetailsForm;
