import CallBlocked from '../filters/CallBlocked';
import CallHistory from '../filters/CallHistory';
import CampaignParticipation from '../filters/CampaignParticipation';
import EmailBlacklist from '../filters/EmailBlacklist';
import EmailClick from '../filters/EmailClick';
import EmailHistory from '../filters/EmailHistory';
import JoinFormFilter from '../filters/JoinForm';
import Journey from '../filters/Journey';
import MostActive from '../filters/MostActive';
import PersonData from '../filters/PersonData';
import PersonField from '../filters/PersonField';
import PersonTags from '../filters/PersonTags';
import PersonView from '../filters/PersonView';
import Random from '../filters/Random';
import SubQuery from '../filters/SubQuery';
import SurveyOption from '../filters/SurveyOption';
import SurveyResponse from '../filters/SurveyResponse';
import SurveySubmission from '../filters/SurveySubmission';
import Task from '../filters/Task';
import User from '../filters/User';
import {
  AnyFilterConfig,
  FILTER_TYPE,
  NewSmartSearchFilter,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

interface FilterEditorProps {
  onCancelSubmitFilter: () => void;
  onSubmitFilter: (
    filter: ZetkinSmartSearchFilter | SmartSearchFilterWithId
  ) => void;
  filter: SmartSearchFilterWithId<AnyFilterConfig> | NewSmartSearchFilter;
}

const FilterEditor = ({
  filter,
  onSubmitFilter,
  onCancelSubmitFilter,
}: FilterEditorProps): JSX.Element => {
  return (
    <>
      {filter.type === FILTER_TYPE.CALL_BLOCKED && (
        <CallBlocked
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.CALL_HISTORY && (
        <CallHistory
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.CAMPAIGN_PARTICIPATION && (
        <CampaignParticipation
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.EMAIL_BLACKLIST && (
        <EmailBlacklist
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.EMAIL_CLICK && (
        <EmailClick
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.EMAIL_HISTORY && (
        <EmailHistory
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.MOST_ACTIVE && (
        <MostActive
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.PERSON_DATA && (
        <PersonData
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.PERSON_FIELD && (
        <PersonField
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.PERSON_TAGS && (
        <PersonTags
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.PERSON_VIEW && (
        <PersonView
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.RANDOM && (
        <Random
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.SUB_QUERY && (
        <SubQuery
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.SURVEY_OPTION && (
        <SurveyOption
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.SURVEY_RESPONSE && (
        <SurveyResponse
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.SURVEY_SUBMISSION && (
        <SurveySubmission
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.TASK && (
        <Task
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.USER && (
        <User
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.JOINFORM && (
        <JoinFormFilter
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
      {filter.type === FILTER_TYPE.JOURNEY && (
        <Journey
          filter={filter}
          onCancel={onCancelSubmitFilter}
          onSubmit={onSubmitFilter}
        />
      )}
    </>
  );
};

export default FilterEditor;
