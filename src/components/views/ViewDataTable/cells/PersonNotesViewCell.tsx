import { FunctionComponent } from 'react';
import { Typography } from '@material-ui/core';

import { ViewGridCellParams } from '.';


export type PersonNotesViewCellParams = ViewGridCellParams<{
    created: string;
    id: number;
    text: string;
}[] | null>;

interface PersonNotesViewCellProps {
    params: PersonNotesViewCellParams;
}

const PersonNotesViewCell: FunctionComponent<PersonNotesViewCellProps> = ({ params }) => {
    if (params.value?.length) {
        const sorted = params.value.concat().sort((n0, n1) => {
            return n0.created < n1.created? 1 : -1;
        });

        return (
            <Typography style={{
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}>
                { sorted[0].text }
            </Typography>
        );
    }

    return null;
};

export default PersonNotesViewCell;
