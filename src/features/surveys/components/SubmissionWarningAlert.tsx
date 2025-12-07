import NextLink from 'next/link';
import { Alert, AlertTitle, Box, Link } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import useSurveyStats from '../hooks/useSurveyStats';

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
  const stats = useSurveyStats(orgId, surveyId);

  if (!stats) {
    return null;
  }

  const unlinkedSubs = stats.unlinkedSubmissionCount;

  if (unlinkedSubs === 0) {
    return null;
  }

  return (
    <>
      {(() => {
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
          </Alert>
        );
      })()}
    </>
  );
};

export default SubmissionWarningAlert;
