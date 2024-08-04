import messageIds from '../l10n/messageIds';
import NextLink from 'next/link';
import { useMessages } from 'core/i18n';
import useSurveyStats from '../hooks/useSurveyStats';
import ZUIFuture from 'zui/ZUIFuture';
import { Alert, AlertTitle, Box, Link } from '@mui/material';

type SubmissionWarningAlertProps = {
  campId: number | 'standalone';
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
