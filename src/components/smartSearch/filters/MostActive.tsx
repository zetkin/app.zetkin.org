import { FormattedMessage as Msg } from 'react-intl';
import { ZetkinSmartSearchFilter } from 'types/zetkin';
import { Box, Button, Divider, MenuItem, TextField, Typography } from '@material-ui/core';
import { FormEvent, useState } from 'react';

import TimeFrame from './TimeFrame';

interface MostActiveProps {
    onSubmit: (filter: ZetkinSmartSearchFilter) => void;
    onCancel: () => void;
}

const MostActive = ({ onSubmit, onCancel }: MostActiveProps): JSX.Element => {
    const [numPeople, setNumPeople] = useState(10);
    const [timeFrame, setTimeFrame] = useState({});
    const [op, setOp] = useState<'add' | 'sub'>('add');

    const [submittable, setSubmittable] = useState(true);

    const handleAddFilter = (e: FormEvent) => {
        e.preventDefault();
        if (submittable) {
            onSubmit({
                config: {
                    size: numPeople,
                    ...timeFrame,
                },
                op,
                type: 'most_active',
            });
        }
    };

    const handleTimeFrameChange = (range: Record<string, unknown>, canSubmit: boolean) => {
        setTimeFrame(range);
        setSubmittable(canSubmit);
    };

    const handleOpChange = (op: string) => {
        if (op === 'add') {
            setOp('add');
        } if (op === 'remove') {
            setOp('sub');
        }
    };

    return (
        <form onSubmit={ e => handleAddFilter(e) }>
            <Typography variant="h4">
                <Msg id="misc.smartSearch.most_active.inputString" values={{
                    addRemoveSelect: (
                        <TextField defaultValue="add"
                            InputProps={{ style: { fontSize: '2.215rem' } }}
                            onChange={ e => handleOpChange(e.target.value) } select>
                            <MenuItem key="add" value="add">
                                <Msg id="misc.smartSearch.most_active.addRemoveSelect.add"/>
                            </MenuItem>
                            <MenuItem key="remove" value="remove">
                                <Msg id="misc.smartSearch.most_active.addRemoveSelect.remove" />
                            </MenuItem>
                        </TextField>
                    ),
                    numPeople: numPeople,
                    numPeopleSelect: (
                        <TextField
                            defaultValue={ numPeople }
                            InputProps={{ style: { fontSize: '2.215rem'  } }} onChange={ (e) => setNumPeople(+e.target.value) } style={{ width: '2rem' }}
                            type="number"
                        />
                    ),
                    timeFrame: (
                        <TimeFrame onChange={ handleTimeFrameChange }/>
                    ),
                }}
                />
            </Typography>
            <Divider />
            <Typography variant="h6">
                <Msg id="misc.smartSearch.headers.examples"/>
            </Typography>
            <Typography color="textSecondary">
                <Msg id="misc.smartSearch.most_active.examples.one"/>
                <br />
                <Msg id="misc.smartSearch.most_active.examples.two"/>
            </Typography>

            <Box display="flex" justifyContent="flex-end" m={ 1 } style={{ gap: '1rem' }}>
                <Button color="primary" onClick={ onCancel }>
                    <Msg id="misc.smartSearch.buttonLabels.cancel"/>
                </Button>
                <Button color="primary" disabled={ !submittable } type="submit" variant="contained">
                    <Msg id="misc.smartSearch.buttonLabels.add"/>
                </Button>
            </Box>
        </form>
    );
};

export default MostActive;
