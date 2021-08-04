import { Box, IconButton, Typography } from '@material-ui/core';
import { DeleteOutline, Settings } from '@material-ui/icons';

import DisplayAll from './filters/All/DisplayAll';
import DisplayCallHistory from './filters/CallHistory/DisplayCallHistory';
import DisplayCampaignParticipation from './filters/CampaignParticipation/DisplayCampaignParticipation';
import DisplayMostActive from './filters/MostActive/DisplayMostActive';
import DisplayPersonData from './filters/PersonData/DisplayPersonData';
import DisplayPersonTags from './filters/PersonTags/DisplayPersonTags';
import DisplayRandom from './filters/Random/DisplayRandom';
import DisplaySurveyResponse from './filters/SurveyResponse/DisplaySurveyResponse';
import DisplaySurveySubmission from './filters/SurveySubmission/DisplaySurveySubmission';
import DisplayUser from './filters/User/DisplayUser';
import { CallHistoryFilterConfig, CampaignParticipationConfig, FILTER_TYPE, MostActiveFilterConfig,
    PersonDataFilterConfig, PersonTagsFilterConfig, RandomFilterConfig, SmartSearchFilterWithId,
    SurveyResponseFilterConfig, SurveySubmissionFilterConfig, UserFilterConfig } from 'types/smartSearch';

interface FilterPreviewProps {
    filter: SmartSearchFilterWithId;
    onDeleteFilter: (filter: SmartSearchFilterWithId) => void;
    onEditFilter: (filter: SmartSearchFilterWithId) => void;
}

const FilterPreview = ({ filter, onDeleteFilter, onEditFilter }:FilterPreviewProps): JSX.Element => {
    return (
        <Box display="flex" width={ 1 }>
            <Box alignItems="center" display="flex" flex={ 20 } justifyContent="center">
                <Typography align="center" variant="body2">
                    { filter.type === FILTER_TYPE.ALL &&
                    <DisplayAll /> }
                    { filter.type === FILTER_TYPE.CALL_HISTORY &&
                    <DisplayCallHistory
                        filter={ filter as SmartSearchFilterWithId<CallHistoryFilterConfig> }
                    /> }
                    { filter.type === FILTER_TYPE.CAMPAIGN_PARTICIPATION &&
                    <DisplayCampaignParticipation
                        filter={ filter as SmartSearchFilterWithId<CampaignParticipationConfig> }
                    /> }
                    { filter.type === FILTER_TYPE.MOST_ACTIVE &&
                    <DisplayMostActive
                        filter={ filter as SmartSearchFilterWithId<MostActiveFilterConfig>  }
                    /> }
                    { filter.type === FILTER_TYPE.PERSON_DATA &&
                    <DisplayPersonData
                        filter={ filter as SmartSearchFilterWithId<PersonDataFilterConfig>  }
                    /> }
                    { filter.type === FILTER_TYPE.PERSON_TAGS &&
                    <DisplayPersonTags
                        filter={ filter as SmartSearchFilterWithId<PersonTagsFilterConfig>  }
                    /> }
                    { filter.type === FILTER_TYPE.RANDOM &&
                    <DisplayRandom
                        filter={ filter as SmartSearchFilterWithId<RandomFilterConfig>  }
                    /> }
                    { filter.type === FILTER_TYPE.SURVEY_RESPONSE &&
                    <DisplaySurveyResponse
                        filter={ filter as SmartSearchFilterWithId<SurveyResponseFilterConfig>  }
                    /> }
                    { filter.type === FILTER_TYPE.SURVEY_SUBMISSION &&
                    <DisplaySurveySubmission
                        filter={ filter as SmartSearchFilterWithId<SurveySubmissionFilterConfig>  }
                    /> }
                    { filter.type === FILTER_TYPE.USER &&
                    <DisplayUser
                        filter={ filter as SmartSearchFilterWithId<UserFilterConfig>  }
                    /> }
                </Typography>
            </Box>
            <Box flex={ 1 }>
                <IconButton
                    onClick={ () => onEditFilter(filter) }>
                    <Settings />
                </IconButton>
            </Box>
            <Box flex={ 1 } width="1rem">
                { filter.type !== FILTER_TYPE.ALL && (
                    <IconButton onClick={ () => onDeleteFilter(filter) }>
                        <DeleteOutline />
                    </IconButton>
                ) }
            </Box>
        </Box>
    );
};

export default FilterPreview;
