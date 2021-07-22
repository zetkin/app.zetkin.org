import { FormattedMessage as Msg } from 'react-intl';
import { Box, Card, CardActions, IconButton, Typography } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';

import { getTimeFrame } from './utils';
import { ZetkinSmartSearchFilterWithId } from 'types/smartSearch';

interface FilterProps {
    filter: ZetkinSmartSearchFilterWithId;
    onDelete: (filter: ZetkinSmartSearchFilterWithId) => void;
    onEdit: (filter: ZetkinSmartSearchFilterWithId) => void;
}


const Filter = ({ filter, onDelete, onEdit }:FilterProps): JSX.Element => {
    const { config, type } = filter;
    const op = filter.op || 'add';
    const timeFrame = getTimeFrame({ after: config?.after, before: config?.before });

    return (
        <Card style={{ margin: '1rem', padding: 0, paddingLeft: '1rem' }}>
            <Box alignItems="center" display="flex" justifyContent="space-between">
                <Typography noWrap variant="h5">
                    <Msg
                        id={ `misc.smartSearch.${type}.inputString` }
                        values={{
                            addRemoveSelect: (
                                <Msg id={ `misc.smartSearch.${type}.addRemoveSelect.${op}` }/>
                            ),
                            numPeople: config?.size,
                            numPeopleSelect: config?.size,
                            timeFrame: (
                                <Msg
                                    id={ `misc.smartSearch.timeFrame.renderedStrings.${timeFrame}` }
                                    values={{
                                        afterDate: (
                                            config?.after
                                        ),
                                        beforeDate: (
                                            config?.before
                                        ),
                                        days: config?.after?.slice(1, config?.after.length - 1),
                                    }}
                                />
                            ) }}
                    />
                </Typography>
                <CardActions>
                    { filter.type !== 'all' && (
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
    );
};




export default Filter;
