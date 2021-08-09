import { ChevronLeft } from '@material-ui/icons';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, ButtonBase, Card, Typography } from '@material-ui/core';

import { FILTER_TYPE } from 'types/smartSearch';

interface FilterGalleryProps {
    onCancelAddNewFilter: () => void;
    onAddNewFilter: (type: FILTER_TYPE) => void;
}

const FilterGallery = ({ onCancelAddNewFilter, onAddNewFilter }:FilterGalleryProps): JSX.Element => {
    return (
        <Box display="flex" flexDirection="column" height={ 1 }>
            <Box>
                <Button
                    color="primary"
                    onClick={ onCancelAddNewFilter }
                    startIcon={ <ChevronLeft/> }>
                    <Msg id="misc.smartSearch.buttonLabels.goBack"/>
                </Button>
                <Typography align="center" variant="h5">
                    <Msg id="misc.smartSearch.headers.gallery"/>
                </Typography>
            </Box>
            <Box
                display="grid"
                gridGap={ 0 }
                gridTemplateColumns="repeat( auto-fit, minmax(300px, 1fr) )">
                { Object.values(FILTER_TYPE)
                    .filter(type => type !== FILTER_TYPE.ALL)
                    .map(type => (
                        <ButtonBase
                            key={ type }
                            disableRipple
                            onClick={ () => onAddNewFilter(type) }>
                            <Card style={{  height: '200px', margin: '1rem', width: '300px' }}>
                                <Box
                                    alignItems="center"
                                    display="flex"
                                    height={ 1 }
                                    justifyContent="center"
                                    padding={ 1 }>
                                    <Typography>
                                        <Msg id={ `misc.smartSearch.filterTitles.${type}` }/>
                                    </Typography>
                                </Box>
                            </Card>
                        </ButtonBase>
                    )) }
            </Box>

        </Box>
    );
};

export default FilterGallery;
