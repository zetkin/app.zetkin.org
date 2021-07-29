import { Box, Card, CardActions, IconButton, Typography } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';

import DisplayAll from './filters/All/DisplayAll';
import DisplayCampaignParticipation from './filters/CampaignParticipation/DisplayCampaignParticipation';
import DisplayMostActive from './filters/MostActive/DisplayMostActive';
import DisplayRandom from './filters/Random/DisplayRandom';
import DisplaySurveySubmission from './filters/SurveySubmission/DisplaySurveySubmission';
import DisplayUser from './filters/User/DisplayUser';
import { CampaignParticipationConfig, FILTER_TYPE, MostActiveFilterConfig, RandomFilterConfig, SmartSearchFilterWithId, SurveySubmissionFilterConfig, UserFilterConfig } from 'types/smartSearch';

interface DisplayFilterProps {
    filter: SmartSearchFilterWithId;
    onDelete: (filter: SmartSearchFilterWithId) => void;
    onEdit: (filter: SmartSearchFilterWithId) => void;
}

const DisplayFilter = ({ filter, onDelete, onEdit }:DisplayFilterProps): JSX.Element => {
    return (
        <>
            <Card style={{ margin: '1rem', padding: 0, paddingLeft: '1rem' }}>
                <Box alignItems="center" display="flex" justifyContent="space-between">
                    <Typography noWrap variant="h5">
                        { filter.type === FILTER_TYPE.ALL && <DisplayAll /> }
                        { filter.type === FILTER_TYPE.MOST_ACTIVE && <DisplayMostActive filter={ filter as SmartSearchFilterWithId<MostActiveFilterConfig>  }/> }
                        { filter.type === FILTER_TYPE.CAMPAIGN_PARTICIPATION && <DisplayCampaignParticipation filter={ filter as SmartSearchFilterWithId<CampaignParticipationConfig> }/> }
                        { filter.type === FILTER_TYPE.RANDOM && <DisplayRandom filter={ filter as SmartSearchFilterWithId<RandomFilterConfig>  }/> }
                        { filter.type === FILTER_TYPE.SURVEY_SUBMISSION && <DisplaySurveySubmission filter={ filter as SmartSearchFilterWithId<SurveySubmissionFilterConfig>  }/> }
                        { filter.type === FILTER_TYPE.USER && <DisplayUser filter={ filter as SmartSearchFilterWithId<UserFilterConfig>  }/> }
                    </Typography>
                    <CardActions>
                        { filter.type !== FILTER_TYPE.ALL && (
                            <IconButton
                                onClick={ () => onEdit(filter) }>
                                <Edit />
                            </IconButton>) }
                        <IconButton onClick={ () => onDelete(filter) }>
                            <Delete />
                        </IconButton>
                    </CardActions>
                </Box>
            </Card>
        </>
    );
};

export default DisplayFilter;
