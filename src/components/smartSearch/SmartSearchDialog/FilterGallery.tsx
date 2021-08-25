import { ChevronLeft } from '@material-ui/icons';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, ButtonBase, Card, Typography, useMediaQuery, useTheme } from '@material-ui/core';

import { FILTER_TYPE } from 'types/smartSearch';

interface FilterGalleryProps {
    onCancelAddNewFilter: () => void;
    onAddNewFilter: (type: FILTER_TYPE) => void;
}

enum FILTER_CATEGORY {
    PEOPLE = 'peopleDatabase',
    PHONE_BANKING = 'phoneBanking',
    CAMPAIGN_ACTIVITY = 'campaignActivity',
    SURVEYS = 'surveys',
    MISC = 'misc',
}

const isFilterInCategory = (filter: FILTER_TYPE, category: FILTER_CATEGORY) => {
    if (category === FILTER_CATEGORY.PEOPLE) {
        return filter === FILTER_TYPE.PERSON_DATA ||
            filter === FILTER_TYPE.PERSON_FIELD ||
            filter === FILTER_TYPE.PERSON_TAGS;
    }
    if (category === FILTER_CATEGORY.PHONE_BANKING) {
        return filter === FILTER_TYPE.CALL_HISTORY;
    }
    if (category === FILTER_CATEGORY.CAMPAIGN_ACTIVITY) {
        return filter === FILTER_TYPE.MOST_ACTIVE ||
            filter === FILTER_TYPE.CAMPAIGN_PARTICIPATION;
    }
    if (category === FILTER_CATEGORY.SURVEYS) {
        return filter === FILTER_TYPE.SURVEY_SUBMISSION ||
            filter === FILTER_TYPE.SURVEY_RESPONSE ||
            filter === FILTER_TYPE.SURVEY_OPTION;
    }
    if (category === FILTER_CATEGORY.MISC) {
        return filter === FILTER_TYPE.RANDOM ||
            filter === FILTER_TYPE.USER ||
            filter === FILTER_TYPE.SUB_QUERY;
    }
};


const FilterGallery = ({ onCancelAddNewFilter, onAddNewFilter }:FilterGalleryProps): JSX.Element => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    return (
        <Box display="flex" flexDirection="column" pb={ 2 }>
            <Box display="flex"
                flexDirection={ isMobile ? 'column' : 'row' }
                justifyContent="space-between"
                mb={ 1 }>
                <Box flex={ 1 }>
                    <Button
                        color="primary"
                        onClick={ onCancelAddNewFilter }
                        startIcon={ <ChevronLeft/> }>
                        <Msg id="misc.smartSearch.buttonLabels.goBack"/>
                    </Button>
                </Box>
                <Box flex={ 1 }>
                    <Typography align="center" variant="h5">
                        <Msg id="misc.smartSearch.headers.gallery"/>
                    </Typography>
                </Box>
                <Box flex={ 1 }>
                </Box>
            </Box>
            { Object.values(FILTER_CATEGORY).map(c => (
                <Box key={ c } margin="auto" width={ 0.9 }>
                    <Box pl={ 2 }>
                        <Typography variant="h6">
                            <Msg id={ `misc.smartSearch.filterCategories.${c}` }/>
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        justifyContent={ isMobile ? 'center' : 'start' }>
                        { Object.values(FILTER_TYPE)
                            .filter(filter => isFilterInCategory(filter, c))
                            .map(filter => (
                                <ButtonBase
                                    key={ filter }
                                    disableRipple
                                    onClick={ () => onAddNewFilter(filter) }>
                                    <Card style={{  height: '200px', margin: '1rem', width: '300px' }}>
                                        <Box
                                            alignItems="center"
                                            display="flex"
                                            height={ 1 }
                                            justifyContent="center"
                                            padding={ 1 }>
                                            <Typography>
                                                <Msg id={ `misc.smartSearch.filterTitles.${filter}` }/>
                                            </Typography>
                                        </Box>
                                    </Card>
                                </ButtonBase>
                            )) }
                    </Box>
                </Box>
            )) }
        </Box>
    );
};

export default FilterGallery;
