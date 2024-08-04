import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import useSurvey from '../hooks/useSurvey';
import useSurveyMutations from '../hooks/useSurveyMutations';
import ZUICard from 'zui/ZUICard';
import { Box, Switch } from '@mui/material';

const SurveySuborgsCard = ({
  orgId,
  surveyId,
}: {
  orgId: number;
  surveyId: number;
}) => {
  const messages = useMessages(messageIds);
  const { data } = useSurvey(orgId, surveyId);
  const { updateSurvey } = useSurveyMutations(orgId, surveyId);
  const orgAccess = data?.org_access === 'sameorg' ? false : true;

  return (
    <Box paddingTop={2}>
      <ZUICard
        header={messages.shareSuborgsCard.title()}
        status={
          <Switch
            checked={orgAccess}
            onChange={(ev) =>
              ev.target.checked
                ? updateSurvey({ org_access: 'suborgs' })
                : updateSurvey({ org_access: 'sameorg' })
            }
          />
        }
        subheader={messages.shareSuborgsCard.caption()}
      />
    </Box>
  );
};

export default SurveySuborgsCard;
