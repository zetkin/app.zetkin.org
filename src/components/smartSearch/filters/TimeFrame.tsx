import DateFnsUtils from '@date-io/date-fns';
import { FormattedMessage as Msg } from 'react-intl';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MenuItem, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';

import { getNewDateWithOffset } from 'utils/dateUtils';
import { getTimeFrame } from '../utils';
import StyledDatePicker from '../inputs/StyledDatePicker';
import StyledNumberInput from '../inputs/StyledNumberInput';
import StyledSelect from '../inputs/StyledSelect';
import { TIME_FRAME } from 'types/smartSearch';

interface TimeFrameProps {
    onChange: (range: {after?: string; before?: string}) => void;
    filterConfig?: {after?: string; before?: string};
}

const TimeFrame = ({ onChange, filterConfig }: TimeFrameProps): JSX.Element => {
    const [selected, setSelected] = useState<TIME_FRAME>(TIME_FRAME.EVER);
    const today = new Date();
    const [before, setBefore] = useState(today);
    const [after, setAfter] = useState(getNewDateWithOffset(today, -30));
    const [numDays, setNumDays] = useState(30);

    useEffect(() => {
        if (filterConfig) {
            const timeFrame = getTimeFrame(filterConfig);
            const { after, before } = filterConfig;
            setSelected(timeFrame);
            if (timeFrame === TIME_FRAME.LAST_FEW_DAYS && after) {
                setNumDays(+after.substring(1, after.length - 1));
                return;
            }
            else if (timeFrame === TIME_FRAME.BETWEEN && after && before) {
                setAfter(new Date(after));
                setBefore(new Date(before));
            }
            else if (timeFrame === TIME_FRAME.AFTER_DATE && after) {
                setAfter(new Date(after));
            }
            else if (timeFrame === TIME_FRAME.BEFORE_DATE && before) {
                setBefore(new Date(before));
            }
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (selected ===  TIME_FRAME.EVER) {
            onChange({});
        }
        if (selected === TIME_FRAME.BEFORE_TODAY) {
            onChange({ before: 'now' });
        }
        if (selected === TIME_FRAME.FUTURE) {
            onChange({ after: 'now' });
        }
        if (selected === TIME_FRAME.LAST_FEW_DAYS) {
            onChange({ after: `-${numDays}d` });
        }
        if (selected === TIME_FRAME.BEFORE_DATE) {
            onChange({ before: before.toISOString().slice(0, 10) });
        }
        if (selected === TIME_FRAME.AFTER_DATE) {
            onChange({ after: after.toISOString().slice(0, 10) });
        }
        if (selected === TIME_FRAME.BETWEEN) {
            onChange({
                after: after.toISOString().slice(0, 10),
                before: before.toISOString().slice(0, 10),
            });
        }
    }, [before, after, selected, numDays]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <MuiPickersUtilsProvider utils={ DateFnsUtils }>
            <Typography display="inline" variant="h4">
                <Msg id={ `misc.smartSearch.timeFrame.edit.${selected}` } values={{
                    afterDateSelect: (
                        <StyledDatePicker
                            onChange={ (date) => setAfter(date as Date) }
                            value={ after }
                        />
                    ),
                    beforeDateSelect: (
                        <StyledDatePicker
                            onChange={ (date) => setBefore(date as Date) }
                            value={ before }
                        />
                    ),
                    daysInput: (
                        <StyledNumberInput
                            onChange={ (e) => setNumDays(+e.target.value) }
                            value={ numDays }
                        />
                    ),
                    timeFrameSelect: (
                        <StyledSelect
                            onChange={ e => setSelected(e.target.value as TIME_FRAME) }
                            SelectProps={{ renderValue: function getLabel(value) {
                                return (
                                    <Msg
                                        id={ `misc.smartSearch.timeFrame.timeFrameSelectLabel.${value}` }
                                        values={{
                                            daysInput: numDays,
                                        }}
                                    />);
                            } }}
                            value={ selected }>
                            { Object.values(TIME_FRAME).map(value => (
                                <MenuItem key={ value } value={ value }>
                                    <Msg id={ `misc.smartSearch.timeFrame.timeFrameSelectOptions.${value}` }/>
                                </MenuItem>
                            )) }
                        </StyledSelect>
                    ),
                }}
                />
            </Typography>
        </MuiPickersUtilsProvider>
    );
};

export default TimeFrame;
