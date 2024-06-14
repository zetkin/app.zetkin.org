import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from '../l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import PaneHeader from 'utils/panes/PaneHeader';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useJoinSubmission from '../hooks/useJoinSubmission';
import useJoinSubmissionMutations from '../hooks/useJoinSubmissionMutations';
import { useMessages } from 'core/i18n';
import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIPerson from 'zui/ZUIPerson';

type Props = {
  orgId: number;
  submissionId: number;
};

const JoinSubmissionPane: FC<Props> = ({ orgId, submissionId }) => {
  const { data } = useJoinSubmission(orgId, submissionId);
  const messages = useMessages(messageIds);
  const globalMessages = useMessages(globalMessageIds);
  const customFields = useCustomFields(orgId);
  const { approveSubmission } = useJoinSubmissionMutations(orgId);

  if (!data) {
    return null;
  }

  function slugToLabel(slug: string): string {
    const isNativeField = Object.values(NATIVE_PERSON_FIELDS).some(
      (nativeSlug) => nativeSlug == slug
    );
    if (isNativeField) {
      const typedSlug = slug as NATIVE_PERSON_FIELDS;
      return globalMessages.personFields[typedSlug]();
    } else {
      const field = customFields.data?.find((field) => field.slug == slug);
      return field?.title ?? '';
    }
  }

  return (
    <>
      <PaneHeader
        subtitle={<ZUIDateTime datetime={data.submitted} />}
        title={`${data.person_data.first_name} ${data.person_data.last_name}`}
      />
      <Box>
        <AttributeWithValue
          label={messages.status()}
          value={messages.submissionPane.states[data.state]()}
        />
        <AttributeWithValue
          label={messages.submissionPane.form()}
          value={data.form.title}
        />
      </Box>
      {!data.accepted ? (
        <Box display="flex" gap={1} justifyContent="stretch" my={4}>
          <Button sx={{ flexGrow: 1 }} variant="outlined">
            {messages.submissionPane.rejectButton()}
          </Button>
          <Button
            onClick={() => approveSubmission(submissionId)}
            sx={{ flexGrow: 1 }}
            variant="contained"
          >
            {messages.submissionPane.approveButton()}
          </Button>
        </Box>
      ) : (
        <Box>
          <ZUIPerson
            id={data.person_data.id}
            link
            name={`${data.person_data.first_name} ${data.person_data.last_name}`}
          />
        </Box>
      )}
      <Box>
        {Object.keys(data.person_data).map((slug) => {
          const value = data.person_data[slug];
          return (
            <AttributeWithValue
              key={slug}
              label={slugToLabel(slug)}
              value={value?.toString() ?? '-'}
            />
          );
        })}
      </Box>
    </>
  );
};

const AttributeWithValue: FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <Box my={1}>
      <Box>
        <Typography variant="body2">{label}</Typography>
      </Box>
      <Box>
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
  );
};

export default JoinSubmissionPane;
