import messageIds from '../l10n/messageIds';
import SurveyDataModel from '../models/SurveyDataModel';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import ZUINumberChip from 'zui/ZUINumberChip';
import { Box, Link, useTheme } from '@mui/material';

type SurveyUnlinkedCardProps = {
  campId: number;
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
  const model = useModel((env) => new SurveyDataModel(env, orgId, surveyId));

  return (
    <ZUIFuture future={model.getStats()}>
      {(sub) => {
        const unlinkedSubmitters = sub.unlinkedSubmissionCount;

        return (
          <>
            {unlinkedSubmitters > 0 && (
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
                  <Link
                    href={`/organize/${orgId}/campaigns/${campId}/surveys/${surveyId}/submissions?filter=linked`}
                  >
                    {messages.unlinkedCard.openLink()}
                  </Link>
                </ZUICard>
              </Box>
            )}
          </>
        );
      }}
    </ZUIFuture>
  );
};

export default SurveyUnlinkedCard;
