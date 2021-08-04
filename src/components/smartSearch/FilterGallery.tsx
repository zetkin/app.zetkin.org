import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, ButtonBase, Card, DialogActions, Typography } from '@material-ui/core';

import { FILTER_TYPE } from 'types/smartSearch';

interface FilterGalleryProps {
    onCancelAddNewFilter: () => void;
    onAddNewFilter: (type: FILTER_TYPE) => void;
}

const FilterGallery = ({ onCancelAddNewFilter, onAddNewFilter }:FilterGalleryProps): JSX.Element => {
    return (
        <>
            <Box
                display="grid"
                gridGap={ 0 }
                gridTemplateColumns="repeat( auto-fit, minmax(300px, 1fr) )">
                { Object.values(FILTER_TYPE).map(type => (
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
            <DialogActions>
                <Box display="flex" justifyContent="flex-end" m={ 1 } style={{ gap: '1rem' }}>
                    <Button color="primary" onClick={ onCancelAddNewFilter } variant="outlined">
                        <Msg id="misc.smartSearch.buttonLabels.cancel"/>
                    </Button>
                </Box>
            </DialogActions>
        </>
    );
};

export default FilterGallery;
