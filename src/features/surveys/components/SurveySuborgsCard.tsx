import { ChangeEvent } from 'react';
import messageIds from '../l10n/messageIds';
import SurveyDataModel from '../models/SurveyDataModel';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
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
  const { data } = model.getData();
  const orgAccess = data?.org_access === 'sameorg' ? false : true;

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.checked) {
      model.updateSurveyAccess('suborgs');
    } else {
      model.updateSurveyAccess('sameorg');
    }
  };

  return (
    <Box paddingTop={2}>
      <ZUICard
        header={messages.shareSuborgsCard.title()}
        status={
          <Switch
            checked={orgAccess}
            onChange={(ev) => handleChange(ev)}
          ></Switch>
        }
        subheader={messages.shareSuborgsCard.caption()}
      >
        {}
      </ZUICard>
    </Box>
  );
};

export default SurveySuborgsCard;
