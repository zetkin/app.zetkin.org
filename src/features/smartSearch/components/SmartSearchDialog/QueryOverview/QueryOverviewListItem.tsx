import { FC } from 'react';
import { Box, IconButton, ListItem, Typography } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

import DisplayCallBlocked from '../../filters/CallBlocked/DisplayCallBlocked';
import DisplayCallHistory from '../../filters/CallHistory/DisplayCallHistory';
import DisplayCampaignParticipation from '../../filters/CampaignParticipation/DisplayCampaignParticipation';
import DisplayMostActive from '../../filters/MostActive/DisplayMostActive';
import DisplayPersonData from '../../filters/PersonData/DisplayPersonData';
import DisplayPersonField from '../../filters/PersonField/DisplayPersonField';
import DisplayPersonTags from '../../filter/PersonTags/DisplayPersonTags';
import DisplayPersonView from '../../filters/PersonView/DisplayPersonView';
import DisplayRandom from '../../filters/Random/DisplayRandom';
import DisplaySubQuery from '../../filters/SubQuery/DisplaySubQuery';
import DisplaySurveyOption from '../../filters/SurveyOption/DisplaySurveyOption';
import DisplaySurveyResponse from '../../filters/SurveyResponse/DisplaySurveyResponse';
import DisplaySurveySubmission from '../../filters/SurveySubmission/DisplaySurveySubmission';
import DisplayTask from '../../filters/Task/DisplayTask';
import DisplayUser from '../../filters/User/DisplayUser';
import {
  AnyFilterConfig,
  CallBlockedFilterConfig,
  CallHistoryFilterConfig,
  CampaignParticipationConfig,
  FILTER_TYPE,
  MostActiveFilterConfig,
  PersonDataFilterConfig,
  PersonFieldFilterConfig,
  PersonTagsFilterConfig,
  PersonViewFilterConfig,
  RandomFilterConfig,
  SmartSearchFilterWithId,
  SubQueryFilterConfig,
  SurveyOptionFilterConfig,
  SurveyResponseFilterConfig,
  SurveySubmissionFilterConfig,
  TaskFilterConfig,
  UserFilterConfig,
} from 'features/smartSearch/components/types';

interface QueryOverviewListItemProps {
  filter: SmartSearchFilterWithId<AnyFilterConfig>;
  onDeleteFilter: (filter: SmartSearchFilterWithId<AnyFilterConfig>) => void;
  onEditFilter: (filter: SmartSearchFilterWithId<AnyFilterConfig>) => void;
  readOnly: boolean;
}

const QueryOverviewListItem: FC<QueryOverviewListItemProps> = ({
  filter,
  onDeleteFilter,
  onEditFilter,
  readOnly,
}) => {
  return (
    <ListItem style={{ padding: '4px 0 0 0' }}>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        width={1}
      >
        <Typography>
          {filter.type === FILTER_TYPE.CALL_BLOCKED && (
            <DisplayCallBlocked
              filter={
                filter as SmartSearchFilterWithId<CallBlockedFilterConfig>
              }
            />
          )}
          {filter.type === FILTER_TYPE.CALL_HISTORY && (
            <DisplayCallHistory
              filter={
                filter as SmartSearchFilterWithId<CallHistoryFilterConfig>
              }
            />
          )}
          {filter.type === FILTER_TYPE.CAMPAIGN_PARTICIPATION && (
            <DisplayCampaignParticipation
              filter={
                filter as SmartSearchFilterWithId<CampaignParticipationConfig>
              }
            />
          )}
          {filter.type === FILTER_TYPE.MOST_ACTIVE && (
            <DisplayMostActive
              filter={filter as SmartSearchFilterWithId<MostActiveFilterConfig>}
            />
          )}
          {filter.type === FILTER_TYPE.PERSON_DATA && (
            <DisplayPersonData
              filter={filter as SmartSearchFilterWithId<PersonDataFilterConfig>}
            />
          )}
          {filter.type === FILTER_TYPE.PERSON_FIELD && (
            <DisplayPersonField
              filter={
                filter as SmartSearchFilterWithId<PersonFieldFilterConfig>
              }
            />
          )}
          {filter.type === FILTER_TYPE.PERSON_TAGS && (
            <DisplayPersonTags
              filter={filter as SmartSearchFilterWithId<PersonTagsFilterConfig>}
            />
          )}
          {filter.type === FILTER_TYPE.PERSON_VIEW && (
            <DisplayPersonView
              filter={filter as SmartSearchFilterWithId<PersonViewFilterConfig>}
            />
          )}
          {filter.type === FILTER_TYPE.RANDOM && (
            <DisplayRandom
              filter={filter as SmartSearchFilterWithId<RandomFilterConfig>}
            />
          )}
          {filter.type === FILTER_TYPE.SUB_QUERY && (
            <DisplaySubQuery
              filter={filter as SmartSearchFilterWithId<SubQueryFilterConfig>}
            />
          )}
          {filter.type === FILTER_TYPE.SURVEY_OPTION && (
            <DisplaySurveyOption
              filter={
                filter as SmartSearchFilterWithId<SurveyOptionFilterConfig>
              }
            />
          )}
          {filter.type === FILTER_TYPE.SURVEY_RESPONSE && (
            <DisplaySurveyResponse
              filter={
                filter as SmartSearchFilterWithId<SurveyResponseFilterConfig>
              }
            />
          )}
          {filter.type === FILTER_TYPE.SURVEY_SUBMISSION && (
            <DisplaySurveySubmission
              filter={
                filter as SmartSearchFilterWithId<SurveySubmissionFilterConfig>
              }
            />
          )}
          {filter.type === FILTER_TYPE.TASK && (
            <DisplayTask
              filter={filter as SmartSearchFilterWithId<TaskFilterConfig>}
            />
          )}
          {filter.type === FILTER_TYPE.USER && (
            <DisplayUser
              filter={filter as SmartSearchFilterWithId<UserFilterConfig>}
            />
          )}
        </Typography>
        {!readOnly && (
          <Box alignItems="center" display="flex">
            <IconButton onClick={() => onEditFilter(filter)} size="small">
              <Edit fontSize="small" />
            </IconButton>
            <IconButton onClick={() => onDeleteFilter(filter)} size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </ListItem>
  );
};

export default QueryOverviewListItem;
