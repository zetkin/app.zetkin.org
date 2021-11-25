import { FunctionComponent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, ButtonBase, Card, Typography, useMediaQuery, useTheme } from '@material-ui/core';

import { COLUMN_TYPE } from 'types/views';

interface ColumnGalleryProps {
    onSelectType: (type: COLUMN_TYPE) => void;
}


const ColumnGallery : FunctionComponent<ColumnGalleryProps> = ({ onSelectType }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box display="flex" flexDirection="column" pb={ 2 }>
            <Box display="flex"
                flexDirection={ isMobile ? 'column' : 'row' }
                justifyContent="space-between"
                mb={ 1 }>
                <Box flex={ 1 }>
                    <Typography align="center" variant="h5">
                        <Msg id="misc.views.columnDialog.gallery.header"/>
                    </Typography>
                </Box>
            </Box>
            <Box>
                { Object.values(COLUMN_TYPE).map(colType => (
                    <ButtonBase
                        key={ colType }
                        disableRipple
                        onClick={ () => onSelectType(colType) }>
                        <Card style={{  height: '200px', margin: '1rem', width: '300px' }}>
                            <Box
                                alignItems="center"
                                display="flex"
                                height={ 1 }
                                justifyContent="center"
                                padding={ 1 }>
                                <Typography>
                                    <Msg id={ `misc.views.columnDialog.types.${colType}` }/>
                                </Typography>
                            </Box>
                        </Card>
                    </ButtonBase>
                )) }
            </Box>
        </Box>
    );
};

export default ColumnGallery;
