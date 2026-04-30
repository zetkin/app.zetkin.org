import NextLink from 'next/link';
import { Alert, AlertTitle, Box, Link } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import useSurveyStats from '../hooks/useSurveyStats';
import ZUIFuture from 'zui/ZUIFuture';

type SubmissionWarningAlertProps = {
  orgId: number;
  projectId: number | 'standalone' | 'shared';
  showUnlinkedOnly: boolean;
  surveyId: number;
};
const SubmissionWarningAlert = ({
  projectId,
  showUnlinkedOnly,
  orgId,
  surveyId,
}: SubmissionWarningAlertProps) => {
  const messages = useMessages(messageIds);
  const statsFuture = useSurveyStats(orgId, surveyId);

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
                href={`/organize/${orgId}/projects/${projectId}/surveys/${surveyId}/submissions${
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
          </Alert>
        );
      }}
    </ZUIFuture>
  );
};

export default SubmissionWarningAlert;
