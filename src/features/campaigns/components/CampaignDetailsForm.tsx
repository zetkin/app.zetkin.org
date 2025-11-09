import { Box, TextField } from '@mui/material';
import { FormEvent, useState } from 'react';

import ZUISubmitCancelButtons from '../../../zui/ZUISubmitCancelButtons';
import { useMessages } from 'core/i18n';
import { ZetkinCampaign, ZetkinPerson } from 'utils/types/zetkin';
import messageIds from '../l10n/messageIds';
import ZUISelect from '../../../zui/components/ZUISelect';

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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        paddingTop: '20px',
      }}
    >
      <TextField
        fullWidth
        id="title"
        label={messages.form.name()}
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        required
        value={title}
      />

      <TextField
        fullWidth
        id="info_text"
        label={messages.form.description()}
        multiline
        name="info_text"
        onChange={(e) => setInfoText(e.target.value)}
        rows={5}
        value={infoText}
        variant="outlined"
      />

      <ZUISelect
        fullWidth
        items={[
          { label: messages.form.status.published(), value: 'published' },
          { label: messages.form.status.draft(), value: 'draft' },
        ]}
        label={messages.form.status.heading()}
        onChange={(e) => setStatus(e as 'published' | 'draft')}
        selectedOption={status}
        size="large"
      />

      <ZUISelect
        fullWidth
        items={[
          { label: messages.form.visibility.private(), value: 'hidden' },
          { label: messages.form.visibility.public(), value: 'open' },
        ]}
        label={messages.form.visibility.heading()}
        onChange={(e) => setVisibility(e as 'hidden' | 'open')}
        selectedOption={visibility}
        size="large"
      />

      <ZUISubmitCancelButtons onCancel={onCancel} />
    </Box>
  );
};

export default CampaignDetailsForm;
