import DateFnsUtils from '@date-io/date-fns';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MenuItem, TextField, Typography } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';

enum RANGES {
    EVER='ever',
    FUTURE='future',
    BEFORE_TODAY='beforeToday',
    BEFORE_DATE='beforeDate',
    AFTER_DATE='afterDate',
    BETWEEN='between',
    LAST_FEW_DAYS='lastFew',
}

interface TimeFrameProps {
    onChange: (range: {after?: string; before?: string}, canSubmit: boolean) => void;
}

const TimeFrame = ({ onChange }: TimeFrameProps): JSX.Element => {
    const intl = useIntl();
    const [selected, setSelected] = useState<RANGES>(RANGES.EVER);
    const [before, setBefore] = useState<MaterialUiPickersDate  | null>(null);
    const [after, setAfter] = useState<MaterialUiPickersDate  | null>(null);
    const [numDays, setNumDays] = useState(30);

    useEffect(() => {
        onChange({}, false);
        if (selected ===  RANGES.EVER) {
            onChange({}, true);
        }
        if (selected === RANGES.BEFORE_TODAY) {
            onChange({ before: 'now' }, true);
        }
        if (selected === RANGES.FUTURE) {
            onChange({ after: 'now' }, true);
        }
        if (selected === RANGES.LAST_FEW_DAYS) {
            onChange({ after: `-${numDays}d` }, true);
        }
        if (selected === RANGES.BEFORE_DATE && before) {
            onChange({ before: before.toISOString().slice(0, 10) }, true);
        }
        if (selected === RANGES.AFTER_DATE && after) {
            onChange({ after: after.toISOString().slice(0, 10) }, true);
        }
        if (selected === RANGES.BETWEEN && after && before) {
            onChange({
                after: after.toISOString().slice(0, 10),
                before: before.toISOString().slice(0, 10),
            }, true);
        }
    }, [before, after, selected, numDays]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <MuiPickersUtilsProvider utils={ DateFnsUtils }>
            <Typography variant="h4">
                <Msg id="misc.smartSearch.timeFrame.inputString" values={{
                    timeFrameSelect: (
                        <TextField InputProps={{ style: { fontSize: '2.215rem' } }} onChange={ e => setSelected(e.target.value as RANGES) }
                            select SelectProps={{ renderValue: function getLabel(value) {
                                return (<Msg
                                    id={ `misc.smartSearch.timeFrame.timeFrameRender.${value}` }
                                />);
                            } }}
                            value={ selected }>
                            { Object.values(RANGES).map(value => (
                                <MenuItem key={ value } value={ value }>
                                    <Msg id={ `misc.smartSearch.timeFrame.timeFrameSelect.${value}` }/>
                                </MenuItem>
                            )) }
                        </TextField>
                    ),
                }}
                />
                { selected === RANGES.BEFORE_DATE && (
                    <Msg id="misc.smartSearch.timeFrame.beforeDate" values={{
                        before: before,
                        beforeDate: (
                            <DatePicker
                                disableToolbar
                                emptyLabel={ intl.formatMessage({ id: 'misc.smartSearch.timeFrame.defaultValue' }) }
                                format="yyyy-MM-dd"
                                id="date-picker-inline"
                                InputProps={{ style: { fontSize: '2.215rem'  } }}
                                onChange={ (date) => setBefore(date) }
                                value={ before }
                                variant="inline"
                            />) }}
                    />)  }
                { selected === RANGES.AFTER_DATE && (
                    <Msg id="misc.smartSearch.timeFrame.afterDate" values={{
                        after: after,
                        afterDate: (
                            <DatePicker
                                disableToolbar
                                emptyLabel={ intl.formatMessage({ id: 'misc.smartSearch.timeFrame.defaultValue' }) }
                                format="yyyy-MM-dd"
                                id="date-picker-inline"
                                InputProps={{ style: { fontSize: '2.215rem'  } }}
                                onChange={ (date) => setAfter(date) }
                                value={ after }
                                variant="inline"
                            />) }}
                    />)  }
                { selected === RANGES.BETWEEN && (
                    <Msg id="misc.smartSearch.timeFrame.between" values={{
                        endDate: (
                            <DatePicker
                                disableToolbar
                                emptyLabel={ intl.formatMessage({ id: 'misc.smartSearch.timeFrame.defaultValue' }) }
                                format="yyyy-MM-dd"
                                id="date-picker-inline"
                                InputProps={{ style: { fontSize: '2.215rem'  } }}
                                onChange={ (date) => setBefore(date) }
                                value={ before }
                                variant="inline"
                            />),
                        startDate: (
                            <DatePicker
                                disableToolbar
                                emptyLabel={ intl.formatMessage({ id: 'misc.smartSearch.timeFrame.defaultValue' }) }
                                format="yyyy-MM-dd"
                                id="date-picker-inline"
                                InputProps={{ style: { fontSize: '2.215rem'  } }}
                                onChange={ (date) => setAfter(date) }
                                value={ after }
                                variant="inline"
                            />) }}
                    />
                )  }
                { selected === RANGES.LAST_FEW_DAYS && (
                    <Msg id="misc.smartSearch.timeFrame.lastFew" values={{
                        numDays: numDays,
                        numDaysSelect: (
                            <TextField
                                InputProps={{ style: { fontSize: '2.215rem'  } }}
                                onChange={ (e) => setNumDays(+e.target.value) }
                                style={{ width: '2rem' }}
                                type="number"
                                value={ numDays }
                            />) }}
                    />
                ) }
            </Typography>
        </MuiPickersUtilsProvider>
    );
};

export default TimeFrame;
