import { FunctionComponent } from 'react';
import { Box, Typography } from '@material-ui/core';

interface ZetkinSectionProps {
    title: string;
    action?: React.ReactNode;
}

const ZetkinSection:FunctionComponent<ZetkinSectionProps> = ({ children, title, action }) => {
    return (
        <Box height={ 1 } p={ 1 } width={ 1 }>
            <Box alignItems="center" display="flex" flexWrap="wrap" justifyContent="space-between">
                <Typography color="secondary" component="h2" variant="h6">
                    { title }
                </Typography>
                { action }
            </Box>
            { children }
        </Box>
    );
};

export default ZetkinSection;
