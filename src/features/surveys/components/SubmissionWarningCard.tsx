import messageIds from '../l10n/messageIds';
import SurveyDataModel from '../models/SurveyDataModel';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';
import { Alert, AlertTitle, Box, Link } from '@mui/material';
import { Msg, useMessages } from 'core/i18n';

type SubmissionWarningCardProps = {
  campId: number;
  filterQuery: string | boolean;
  orgId: number;
  surveyId: number;
};
const SubmissionWarningCard = ({
  campId,
  filterQuery,
  orgId,
  surveyId,
}: SubmissionWarningCardProps) => {
  const model = useModel((env) => new SurveyDataModel(env, orgId, surveyId));
  const messages = useMessages(messageIds);

  return (
    <ZUIFuture future={model.getStats()}>
      {(sub) => {
        const unlinkedSubs = sub.unlinkedSubmissionCount;

        return (
          <>
            {unlinkedSubs > 0 && (
              <Alert severity="warning" sx={{ marginLeft: 2 }}>
                <AlertTitle>
                  <Msg
                    id={
                      filterQuery
                        ? messageIds.unlinkedWarningCard.viewUnlinkHeader
                        : messageIds.unlinkedWarningCard.header
                    }
                  />
                </AlertTitle>
                <Msg
                  id={
                    filterQuery
                      ? messageIds.unlinkedWarningCard.viewUnlinkedDesc
                      : messageIds.unlinkedWarningCard.description
                  }
                />
                <Box>
                  <Link
                    href={`/organize/${orgId}/campaigns/${campId}/surveys/${surveyId}/submissions${
                      filterQuery ? '' : '?filter=linked'
                    }`}
                  >
                    {filterQuery
                      ? messages.unlinkedWarningCard.viewAll()
                      : messages.unlinkedWarningCard.viewUnlink()}
                  </Link>
                </Box>
              </Alert>
            )}
          </>
        );
      }}
    </ZUIFuture>
  );
};

export default SubmissionWarningCard;
