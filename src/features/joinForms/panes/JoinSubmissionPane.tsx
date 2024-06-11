import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import globalMessageIds from 'core/i18n/globalMessageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import PaneHeader from 'utils/panes/PaneHeader';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useJoinSubmission from '../hooks/useJoinSubmission';
import { useMessages } from 'core/i18n';

type Props = {
  orgId: number;
  submissionId: number;
};

const JoinSubmissionPane: FC<Props> = ({ orgId, submissionId }) => {
  const { data } = useJoinSubmission(orgId, submissionId);
  const globalMessages = useMessages(globalMessageIds);
  const customFields = useCustomFields(orgId);

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
        title={`${data.person_data.first_name} ${data.person_data.last_name}`}
      />
      <Box>
        {Object.keys(data.person_data).map((slug) => {
          const value = data.person_data[slug];
          return (
            <Box key={slug} my={1}>
              <Box>
                <Typography variant="body2">{slugToLabel(slug)}</Typography>
              </Box>
              <Box>
                <Typography variant="body1">
                  {value?.toString() ?? '-'}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default JoinSubmissionPane;
