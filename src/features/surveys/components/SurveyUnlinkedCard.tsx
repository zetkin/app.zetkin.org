import { makeStyles } from '@mui/styles';
import messageIds from '../l10n/messageIds';
import SurveySubmissionsModel from '../models/SurveySubmissionsModel';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import ZUINumberChip from 'zui/ZUINumberChip';
import { Box, useTheme } from '@mui/material';

type SurveyUnlinkedCardProps = {
  orgId: number;
  surveyId: number;
};

const useStyles = makeStyles({
  unlinkedAvatar: { backgroundColor: 'grey' },
});

const SurveyUnlinkedCard = ({ orgId, surveyId }: SurveyUnlinkedCardProps) => {
  const styles = useStyles();
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const subsModel = useModel(
    (env) => new SurveySubmissionsModel(env, orgId, surveyId)
  );

  return (
    <ZUIFuture future={subsModel.getSubmissions()}>
      {(submissions) => {
        const unlinkedSubmitters = submissions.filter((sub) => {
          if (sub.respondent !== null) {
            return sub.respondent.id === undefined;
          }
        });
        return (
          <>
            {unlinkedSubmitters.length > 0 && (
              <Box paddingTop={2}>
                <ZUICard
                  header={messages.unlinkedCard.header()}
                  status={
                    <ZUINumberChip
                      color={theme.palette.grey[200]}
                      value={unlinkedSubmitters.length}
                    />
                  }
                  subheader={messages.unlinkedCard.description()}
                >
                  {unlinkedSubmitters.map((submitter, index) => (
                    <Box
                      key={`unsubmitter-${
                        submitter.respondent!.first_name
                      }-${index}`}
                      className={styles.unlinkedAvatar}
                    >
                      {`${submitter.respondent!.first_name}
                      ${submitter.respondent!.last_name}`}
                    </Box>
                  ))}
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
