import { FormattedMessage as Msg } from 'react-intl';
import { Box, IconButton } from '@material-ui/core';
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
        <Box
            border={ 1 }
            borderColor={ op === 'sub' ? 'error.light' : 'success.light' }
            display="flex"
            justifyContent="space-between"
            m={ 1 }
            p={ 1 }>
            <Box>
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
            </Box>
            <Box display="flex" style={{ gap: '1rem' }}>
                { filter.type !== 'all' && (
                    <IconButton
                        onClick={ () => onEdit(filter) }>
                        <Edit />
                    </IconButton>) }
                <IconButton onClick={ () => onDelete(filter) }>
                    <Delete />
                </IconButton>
            </Box>
        </Box>
    );
};




export default Filter;
