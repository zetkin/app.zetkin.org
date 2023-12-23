import messageIds from '../l10n/messageIds';
import NextLink from 'next/link';
import { useMessages } from 'core/i18n';
import useSurveyStats from '../hooks/useSurveyStats';
import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import ZUINumberChip from 'zui/ZUINumberChip';
import { Box, Link, useTheme } from '@mui/material';

type SurveyUnlinkedCardProps = {
  campId: number | 'standalone' | 'shared';
  orgId: number;
  surveyId: number;
};

const SurveyUnlinkedCard = ({
  campId,
  orgId,
  surveyId,
}: SurveyUnlinkedCardProps) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const statsFuture = useSurveyStats(orgId, surveyId);

  return (
    <ZUIFuture future={statsFuture}>
      {(sub) => {
        const unlinkedSubmitters = sub.unlinkedSubmissionCount;

        return unlinkedSubmitters > 0 ? (
          <Box paddingTop={2}>
            <ZUICard
              header={messages.unlinkedCard.header()}
              status={
                <ZUINumberChip
                  color={theme.palette.grey[200]}
                  value={unlinkedSubmitters}
                />
              }
              subheader={messages.unlinkedCard.description()}
            >
              <NextLink
                href={`/organize/${orgId}/projects/${campId}/surveys/${surveyId}/submissions?filter=linked`}
                passHref
              >
                <Link>
                  {messages.unlinkedCard.openLink({
                    numUnlink: unlinkedSubmitters,
                  })}
                </Link>
              </NextLink>
            </ZUICard>
          </Box>
        ) : null;
      }}
    </ZUIFuture>
  );
};

export default SurveyUnlinkedCard;
