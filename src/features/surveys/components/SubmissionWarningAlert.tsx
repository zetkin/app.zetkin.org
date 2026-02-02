import NextLink from 'next/link';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Link,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import useSurveyStats from '../hooks/useSurveyStats';
import ZUIFuture from 'zui/ZUIFuture';
import { AutoLinkSubmissionsDialog } from 'features/surveys/components/AutoLinkSubmissionsDialog';

type SubmissionWarningAlertProps = {
  campId: number | 'standalone' | 'shared';
  orgId: number;
  showUnlinkedOnly: boolean;
  surveyId: number;
};
const SubmissionWarningAlert = ({
  campId,
  showUnlinkedOnly,
  orgId,
  surveyId,
}: SubmissionWarningAlertProps) => {
  const messages = useMessages(messageIds);
  const statsFuture = useSurveyStats(orgId, surveyId);
  const [autoLinkModalOpen, setAutoLinkModalOpen] = useState(false);

  return (
    <ZUIFuture future={statsFuture}>
      {(sub) => {
        const unlinkedSubs = sub.unlinkedSubmissionCount;

        if (unlinkedSubs === 0) {
          return null;
        }

        return (
          <Alert severity="warning">
            <AlertTitle>
              {showUnlinkedOnly
                ? messages.unlinkedWarningAlert.filtered.header()
                : messages.unlinkedWarningAlert.default.header()}
            </AlertTitle>
            {showUnlinkedOnly
              ? messages.unlinkedWarningAlert.filtered.description()
              : messages.unlinkedWarningAlert.default.description({
                  numUnlink: unlinkedSubs,
                })}
            <Box>
              <NextLink
                href={`/organize/${orgId}/projects/${campId}/surveys/${surveyId}/submissions${
                  showUnlinkedOnly ? '' : '?filter=linked'
                }`}
                legacyBehavior
                passHref
              >
                <Link>
                  {showUnlinkedOnly
                    ? messages.unlinkedWarningAlert.filtered.viewAll()
                    : messages.unlinkedWarningAlert.default.viewUnlinked()}
                </Link>
              </NextLink>
            </Box>
            <Box>
              <Typography
                sx={{
                  my: '5px',
                }}
                variant={'body2'}
              >{`${sub.autoLinkableSubmissionCount} submissions can be auto linked`}</Typography>
              <Button
                disabled={sub.autoLinkableSubmissionCount === '0'}
                onClick={() => setAutoLinkModalOpen(true)}
                size={'small'}
                variant={'outlined'}
              >
                Auto link submissions
              </Button>
              {autoLinkModalOpen && (
                <AutoLinkSubmissionsDialog
                  onClose={() => setAutoLinkModalOpen(false)}
                  open={autoLinkModalOpen}
                  orgId={orgId}
                  surveyId={surveyId}
                />
              )}
            </Box>
          </Alert>
        );
      }}
    </ZUIFuture>
  );
};

export default SubmissionWarningAlert;
