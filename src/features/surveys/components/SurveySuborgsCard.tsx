import messageIds from '../l10n/messageIds';
import SurveyDataModel from '../models/SurveyDataModel';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useSurvey from '../hooks/useSurvey';
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
  const model = useModel((env) => new SurveyDataModel(env, orgId, surveyId));
  const { data } = useSurvey(orgId, surveyId);
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
                ? model.updateSurveyAccess('suborgs')
                : model.updateSurveyAccess('sameorg')
            }
          />
        }
        subheader={messages.shareSuborgsCard.caption()}
      >
        <></>
      </ZUICard>
    </Box>
  );
};

export default SurveySuborgsCard;
