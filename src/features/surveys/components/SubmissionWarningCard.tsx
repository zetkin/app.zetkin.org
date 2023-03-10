import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import SurveyDataModel from '../models/SurveyDataModel';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';
import { Alert, AlertTitle } from '@mui/material';

type SubmissionWarningCardProps = {
  orgId: number;
  surveyId: number;
};
const SubmissionWarningCard = ({
  orgId,
  surveyId,
}: SubmissionWarningCardProps) => {
  const model = useModel((env) => new SurveyDataModel(env, orgId, surveyId));

  return (
    <ZUIFuture future={model.getStats()}>
      {(sub) => {
        const unlinkedSubs = sub.unlinkedSubmissionCount;

        return (
          <>
            {unlinkedSubs > 0 && (
              <Alert severity="warning" sx={{ marginLeft: 2 }}>
                <AlertTitle>
                  <Msg id={messageIds.unlinkedWarningCard.header} />
                </AlertTitle>
                <Msg id={messageIds.unlinkedWarningCard.description} />
              </Alert>
            )}
          </>
        );
      }}
    </ZUIFuture>
  );
};

export default SubmissionWarningCard;
