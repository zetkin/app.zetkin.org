import { FormEvent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import { FILTER_TYPE, OPERATION, ZetkinSmartSearchFilter } from 'types/smartSearch';

interface AllProps {
    onSubmit: (filter: ZetkinSmartSearchFilter) => void;
    onCancel: () => void;
}

const All = ({ onSubmit, onCancel }: AllProps): JSX.Element => {

    const handleSubmitFilter = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ op: OPERATION.ADD, type: FILTER_TYPE.ALL  });
    };

    return (
        <form onSubmit={ e => handleSubmitFilter(e) }>
            <Typography variant="h4">
                <Msg id="misc.smartSearch.all.inputString"/>
            </Typography>
            <Divider />
            <Box display="flex" justifyContent="flex-end" m={ 1 } style={{ gap: '1rem' }}>
                <Button color="primary" onClick={ onCancel }>
                    <Msg id="misc.smartSearch.buttonLabels.cancel"/>
                </Button>
                <Button color="primary" type="submit" variant="contained">
                    <Msg id="misc.smartSearch.buttonLabels.add"/>
                </Button>
            </Box>
        </form>
    );
};

export default All;
