import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Link, MenuItem } from '@mui/material';

import getUserMemberships from 'utils/fetching/getUserMemberships';
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
  const { orgId } = useRouter().query;
  const messages = useMessages(messageIds);

  const membershipsQuery = useQuery('userMemberships', getUserMemberships());
  const activeMembership = membershipsQuery?.data?.find(
    (m) => m.organization.id.toString() == orgId
  );
  const userProfile = activeMembership?.profile;

  const [selectedManager, setSelectedManager] = useState<ZetkinPerson | null>(
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

          {/* This is broken due to MUIv5 migration, but will be replaced by new UI
          <ZUIPersonSelect
            label={intl.formatMessage({
              id: 'misc.formDialog.campaign.manager.label',
            })}
            name="manager_id"
            onChange={(person) => {
              setSelectedManager(person);
            }}
            selectedPerson={selectedManager}
          />
          */}

          {userProfile && userProfile.id != selectedManager?.id && (
            <Link
              color="textPrimary"
              component="button"
              onClick={() => {
                // Select profile beloning to current user. We only need the ID
                // to be correct, and the name to be reflected by first_name+last_name,
                // so for simplicity we pass the entire name as first name.
                setSelectedManager({
                  first_name: userProfile.name,
                  id: userProfile.id,
                  last_name: '',
                } as ZetkinPerson);
              }}
              underline="hover"
            >
              <Msg id={messageIds.form.manager.selectSelf} />
            </Link>
          )}

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
