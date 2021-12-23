import { ExpandMore } from '@material-ui/icons';
import { Box, Button, Popover, Typography } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';

import { ViewGridCellParams } from '.';


export type SurveyResponseViewCellParams = ViewGridCellParams<{
    submission_id: number;
    text: string;
}[] | null>;

interface SurveyResponseViewCellProps {
    params: SurveyResponseViewCellParams;
}

const SurveyResponseViewCell: FunctionComponent<SurveyResponseViewCellProps> = ({ params }) => {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    if (params.value?.length) {
        return (
            <>
                <Box
                    alignItems="center"
                    display="flex"
                    onClick={ ev => setAnchorEl(ev.target as Element) }>
                    <Button>
                        <ExpandMore/>
                    </Button>
                    <Typography style={{
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        { params.value[0].text }
                    </Typography>
                </Box>
                <Popover
                    anchorEl={ anchorEl }
                    onClose={ () => setAnchorEl(null) }
                    open={ Boolean(anchorEl) }>
                    { params.value.map(response => (
                        <Box key={ response.submission_id } m={ 2 }>
                            <Typography>
                                { response.text }
                            </Typography>
                        </Box>
                    )) }
                </Popover>
            </>
        );
    }

    return null;
};

export default SurveyResponseViewCell;
