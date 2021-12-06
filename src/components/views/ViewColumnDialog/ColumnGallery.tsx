import { FunctionComponent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, ButtonBase, Card, Typography } from '@material-ui/core';

import { AUTO_SAVE_TYPES } from '.';
import { COLUMN_TYPE } from 'types/views';

interface ColumnGalleryProps {
    onSelectType: (type: COLUMN_TYPE) => void;
}

const ColumnGallery : FunctionComponent<ColumnGalleryProps> = ({ onSelectType }) => {
    return (
        <Box display="grid" gridGap="1rem" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" justifyItems="center">
            { Object.values(COLUMN_TYPE).map(colType => (
                <ButtonBase
                    key={ colType }
                    disableRipple
                    onClick={ () => onSelectType(colType) }
                    style={{ width: 'min-content' }}>
                    <Card style={{ height: '150px', width: '300px' }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            height="100%"
                            justifyContent="space-between"
                            padding={ 2 }>
                            <Typography>
                                <Msg id={ `misc.views.columnDialog.types.${colType}` }/>
                            </Typography>
                            <Button fullWidth variant="outlined">
                                {
                                    AUTO_SAVE_TYPES.includes(colType) ?
                                        <Msg id="misc.views.columnDialog.gallery.addToView"/> :
                                        <Msg id="misc.views.columnDialog.gallery.configureColumn"/>
                                }

                            </Button>
                        </Box>
                    </Card>
                </ButtonBase>
            )) }
        </Box>
    );
};

export default ColumnGallery;
