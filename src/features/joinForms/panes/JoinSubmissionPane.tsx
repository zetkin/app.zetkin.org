import { FC } from 'react';
import NextLink from 'next/link';
import { Avatar, Box, Button, Link, Typography } from '@mui/material';

import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from '../l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import PaneHeader from 'utils/panes/PaneHeader';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useJoinSubmission from '../hooks/useJoinSubmission';
import useJoinSubmissionMutations from '../hooks/useJoinSubmissionMutations';
import { useMessages } from 'core/i18n';
import ZUIDateTime from 'zui/ZUIDateTime';

type Props = {
  orgId: number;
  submissionId: number;
};

const JoinSubmissionPane: FC<Props> = ({ orgId, submissionId }) => {
  const { data: joinSubmission } = useJoinSubmission(orgId, submissionId);
  const messages = useMessages(messageIds);
  const globalMessages = useMessages(globalMessageIds);
  const customFields = useCustomFields(orgId);
  const { approveSubmission } = useJoinSubmissionMutations(orgId);

  if (!joinSubmission) {
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

  const Header = () => {
    if (joinSubmission.accepted) {
      return (
        <Box marginBottom={2} marginRight={2}>
          <NextLink
            href={`/organize/${orgId}/people/${joinSubmission.person_data.id}`}
            legacyBehavior
            passHref
          >
            <Link style={{ cursor: 'pointer' }} underline="none">
              <Box alignItems="center" display="flex">
                <Avatar
                  src={`/api/orgs/${orgId}/people/${joinSubmission.person_data.id}/avatar`}
                  style={{ height: 30, width: 30 }}
                />
                <Box
                  alignItems="start"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  ml={1}
                >
                  <Typography fontSize={30} variant="h3">
                    {`${joinSubmission.person_data.first_name} ${joinSubmission.person_data.last_name}`}
                  </Typography>
                </Box>
              </Box>
            </Link>
          </NextLink>
          <Box>{<ZUIDateTime datetime={joinSubmission.submitted} />}</Box>
        </Box>
      );
    } else {
      return (
        <PaneHeader
          subtitle={<ZUIDateTime datetime={joinSubmission.submitted} />}
          title={`${joinSubmission.person_data.first_name} ${joinSubmission.person_data.last_name}`}
        />
      );
    }
  };

  return (
    <>
      <Header />
      <Box>
        <AttributeWithValue
          label={messages.status()}
          value={messages.states[joinSubmission.state]()}
        />
        <AttributeWithValue
          label={messages.submissionPane.form()}
          value={joinSubmission.form.title}
        />
      </Box>
      {!joinSubmission.accepted && (
        <Box display="flex" gap={1} justifyContent="stretch" my={4}>
          {/* TODO: Handle rejectButton click */}
          {/* <Button sx={{ flexGrow: 1 }} variant="outlined">
            {messages.submissionPane.rejectButton()}
          </Button> */}
          <Button
            onClick={() => approveSubmission(submissionId)}
            sx={{ width: '50%' }}
            variant="contained"
          >
            {messages.submissionPane.approveButton()}
          </Button>
        </Box>
      )}
      <Box>
        {Object.keys(joinSubmission.person_data).map((slug) => {
          const value = joinSubmission.person_data[slug];
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
