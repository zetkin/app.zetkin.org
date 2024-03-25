import {
  AccountCircleOutlined,
  Add,
  AssignmentOutlined,
  BallotOutlined,
  Block,
  Call,
  CheckBoxOutlined,
  DraftsOutlined,
  Event,
  FilterAlt,
  LocalOfferOutlined,
  MarkEmailReadOutlined,
  PersonAddAlt,
  PersonOutlined,
  PhoneDisabled,
  Remove,
  Search,
  ShuffleOutlined,
  SpeakerNotesOutlined,
  ViewListOutlined,
} from '@mui/icons-material';

import DisplayCallBlocked from '../../filters/CallBlocked/DisplayCallBlocked';
import DisplayCallHistory from '../../filters/CallHistory/DisplayCallHistory';
import DisplayCampaignParticipation from '../../filters/CampaignParticipation/DisplayCampaignParticipation';
import DisplayEmailBlacklist from '../../filters/EmailBlacklist/DisplayEmailBlacklist';
import DisplayEmailClick from '../../filters/EmailClick/DisplayEmailClick';
import DisplayEmailHistory from '../../filters/EmailHistory/DisplayEmailHistory';
import DisplayMostActive from '../../filters/MostActive/DisplayMostActive';
import DisplayPersonData from '../../filters/PersonData/DisplayPersonData';
import DisplayPersonField from '../../filters/PersonField/DisplayPersonField';
import DisplayPersonTags from '../../filters/PersonTags/DisplayPersonTags';
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
  EmailBlacklistFilterConfig,
  EmailClickFilterConfig,
  EmailHistoryFilterConfig,
  FILTER_TYPE,
  MostActiveFilterConfig,
  OPERATION,
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

export default function getFilterComponents(
  filter: SmartSearchFilterWithId<AnyFilterConfig>
) {
  let filterOperatorIcon: JSX.Element | undefined = (
    <Add color="secondary" fontSize="small" />
  );
  if (!filter.op) {
    filterOperatorIcon = undefined;
  } else if (filter.op === OPERATION.SUB) {
    filterOperatorIcon = <Remove color="secondary" fontSize="small" />;
  } else if (filter.op === OPERATION.LIMIT) {
    filterOperatorIcon = <FilterAlt color="secondary" fontSize="small" />;
  }

  //Uses CALL_BLOCKED as default
  let filterTypeIcon = <PhoneDisabled color="secondary" fontSize="small" />;
  let displayFilter = (
    <DisplayCallBlocked
      filter={filter as SmartSearchFilterWithId<CallBlockedFilterConfig>}
    />
  );
  if (filter.type === FILTER_TYPE.CALL_HISTORY) {
    displayFilter = (
      <DisplayCallHistory
        filter={filter as SmartSearchFilterWithId<CallHistoryFilterConfig>}
      />
    );
    filterTypeIcon = <Call color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.EMAIL_BLACKLIST) {
    displayFilter = (
      <DisplayEmailBlacklist
        filter={filter as SmartSearchFilterWithId<EmailBlacklistFilterConfig>}
      />
    );
    filterTypeIcon = <Block color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.EMAIL_CLICK) {
    displayFilter = (
      <DisplayEmailClick
        filter={filter as SmartSearchFilterWithId<EmailClickFilterConfig>}
      />
    );
    filterTypeIcon = (
      <MarkEmailReadOutlined color="secondary" fontSize="small" />
    );
  } else if (filter.type === FILTER_TYPE.EMAIL_HISTORY) {
    displayFilter = (
      <DisplayEmailHistory
        filter={filter as SmartSearchFilterWithId<EmailHistoryFilterConfig>}
      />
    );
    filterTypeIcon = <DraftsOutlined color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.CAMPAIGN_PARTICIPATION) {
    displayFilter = (
      <DisplayCampaignParticipation
        filter={filter as SmartSearchFilterWithId<CampaignParticipationConfig>}
      />
    );
    filterTypeIcon = <Event color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.MOST_ACTIVE) {
    displayFilter = (
      <DisplayMostActive
        filter={filter as SmartSearchFilterWithId<MostActiveFilterConfig>}
      />
    );
  } else if (filter.type === FILTER_TYPE.PERSON_DATA) {
    displayFilter = (
      <DisplayPersonData
        filter={filter as SmartSearchFilterWithId<PersonDataFilterConfig>}
      />
    );
    filterTypeIcon = <PersonOutlined color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.PERSON_FIELD) {
    displayFilter = (
      <DisplayPersonField
        filter={filter as SmartSearchFilterWithId<PersonFieldFilterConfig>}
      />
    );
    filterTypeIcon = <PersonAddAlt color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.PERSON_TAGS) {
    displayFilter = (
      <DisplayPersonTags
        filter={filter as SmartSearchFilterWithId<PersonTagsFilterConfig>}
      />
    );
    filterTypeIcon = <LocalOfferOutlined color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.PERSON_VIEW) {
    displayFilter = (
      <DisplayPersonView
        filter={filter as SmartSearchFilterWithId<PersonViewFilterConfig>}
      />
    );
    filterTypeIcon = <ViewListOutlined color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.RANDOM) {
    displayFilter = (
      <DisplayRandom
        filter={filter as SmartSearchFilterWithId<RandomFilterConfig>}
      />
    );
    filterTypeIcon = <ShuffleOutlined color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.SUB_QUERY) {
    displayFilter = (
      <DisplaySubQuery
        filter={filter as SmartSearchFilterWithId<SubQueryFilterConfig>}
      />
    );
    filterTypeIcon = <Search color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.SURVEY_OPTION) {
    displayFilter = (
      <DisplaySurveyOption
        filter={filter as SmartSearchFilterWithId<SurveyOptionFilterConfig>}
      />
    );
    filterTypeIcon = <BallotOutlined color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.SURVEY_RESPONSE) {
    displayFilter = (
      <DisplaySurveyResponse
        filter={filter as SmartSearchFilterWithId<SurveyResponseFilterConfig>}
      />
    );
    filterTypeIcon = (
      <SpeakerNotesOutlined color="secondary" fontSize="small" />
    );
  } else if (filter.type === FILTER_TYPE.SURVEY_SUBMISSION) {
    displayFilter = (
      <DisplaySurveySubmission
        filter={filter as SmartSearchFilterWithId<SurveySubmissionFilterConfig>}
      />
    );
    filterTypeIcon = <AssignmentOutlined color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.TASK) {
    displayFilter = (
      <DisplayTask
        filter={filter as SmartSearchFilterWithId<TaskFilterConfig>}
      />
    );
    filterTypeIcon = <CheckBoxOutlined color="secondary" fontSize="small" />;
  } else if (filter.type === FILTER_TYPE.USER) {
    displayFilter = (
      <DisplayUser
        filter={filter as SmartSearchFilterWithId<UserFilterConfig>}
      />
    );
    filterTypeIcon = (
      <AccountCircleOutlined color="secondary" fontSize="small" />
    );
  }

  return {
    displayFilter,
    filterOperatorIcon,
    filterTypeIcon,
  };
}
