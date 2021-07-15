import { FunctionComponent } from 'react';
import { Box, Typography } from '@material-ui/core';

interface ZetkinSectionProps {
    title: string;
}

const ZetkinSection:FunctionComponent<ZetkinSectionProps> = ({ children, title }) => {
    return (
        <Box height={ 1 } p={ 1 } width={ 1 }>
            <Box mb={ 2 }>
                <Typography color="secondary" component="h2" variant="h6">
                    { title }
                </Typography>
            </Box>
            { children }
        </Box>
    );
};

export default ZetkinSection;
