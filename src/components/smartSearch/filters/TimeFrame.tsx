import DateFnsUtils from '@date-io/date-fns';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MenuItem, Typography } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';

import StyledDatePicker from '../inputs/StyledDatePicker';
import StyledNumberInput from '../inputs/StyledNumberInput';
import StyledSelect from '../inputs/StyledSelect';

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
    filterConfig?: {after?: string; before?: string};
}

const TimeFrame = ({ onChange, filterConfig }: TimeFrameProps): JSX.Element => {
    const intl = useIntl();
    const [selected, setSelected] = useState<RANGES>(RANGES.EVER);
    const [before, setBefore] = useState<MaterialUiPickersDate  | null>(null);
    const [after, setAfter] = useState<MaterialUiPickersDate  | null>(null);
    const [numDays, setNumDays] = useState(30);

    useEffect(() => {
        if (filterConfig) {
            const { after, before } = filterConfig;
            if (after && after.slice(0, 1) === '-') {
                setSelected(RANGES.LAST_FEW_DAYS);
                setNumDays(+after.substring(1, after.length - 1));
                return;
            }
            if (after === 'now') {
                setSelected(RANGES.FUTURE);
            }
            else if (before === 'now') {
                setSelected(RANGES.BEFORE_TODAY);
            }
            else if (after && before) {
                setSelected(RANGES.BETWEEN);
                setAfter(new Date(after));
                setBefore(new Date(before));
            }
            else if (after && !before) {
                setSelected(RANGES.AFTER_DATE);
                setAfter(new Date(after));
            }
            else if (!after && before) {
                setSelected(RANGES.BEFORE_DATE);
                setBefore(new Date(before));
            }
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
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
            <Typography display="inline" variant="h4">
                <Msg id="misc.smartSearch.timeFrame.inputString" values={{
                    timeFrameSelect: (
                        <StyledSelect
                            onChange={ e => setSelected(e.target.value as RANGES) }
                            SelectProps={{ renderValue: function getLabel(value) {
                                return (
                                    <Msg
                                        id={ `misc.smartSearch.timeFrame.timeFrameRender.${value}` }
                                    />);
                            } }}
                            value={ selected }>
                            { Object.values(RANGES).map(value => (
                                <MenuItem key={ value } value={ value }>
                                    <Msg id={ `misc.smartSearch.timeFrame.timeFrameSelect.${value}` }/>
                                </MenuItem>
                            )) }
                        </StyledSelect>
                    ),
                }}
                />
                { selected === RANGES.BEFORE_DATE && (
                    <Msg id="misc.smartSearch.timeFrame.beforeDate" values={{
                        before: before,
                        beforeDate: (
                            <StyledDatePicker
                                emptyLabel={ intl.formatMessage({ id: 'misc.smartSearch.timeFrame.defaultValue' }) }
                                onChange={ (date) => setBefore(date) }
                                value={ before }
                            />) }}
                    />)  }
                { selected === RANGES.AFTER_DATE && (
                    <Msg id="misc.smartSearch.timeFrame.afterDate" values={{
                        after: after,
                        afterDate: (
                            <StyledDatePicker
                                emptyLabel={ intl.formatMessage({ id: 'misc.smartSearch.timeFrame.defaultValue' }) }
                                onChange={ (date) => setAfter(date) }
                                value={ after }
                            />) }}
                    />)  }
                { selected === RANGES.BETWEEN && (
                    <Msg id="misc.smartSearch.timeFrame.between" values={{
                        endDate: (
                            <StyledDatePicker
                                emptyLabel={ intl.formatMessage({ id: 'misc.smartSearch.timeFrame.defaultValue' }) }
                                onChange={ (date) => setBefore(date) }
                                value={ before }
                            />),
                        startDate: (
                            <StyledDatePicker
                                emptyLabel={ intl.formatMessage({ id: 'misc.smartSearch.timeFrame.defaultValue' }) }
                                onChange={ (date) => setAfter(date) }
                                value={ after }
                            />) }}
                    />
                )  }
                { selected === RANGES.LAST_FEW_DAYS && (
                    <Msg id="misc.smartSearch.timeFrame.lastFew" values={{
                        numDays: numDays,
                        numDaysSelect: (
                            <StyledNumberInput
                                onChange={ (e) => setNumDays(+e.target.value) }
                                value={ numDays }
                            />) }}
                    />
                ) }
            </Typography>
        </MuiPickersUtilsProvider>
    );
};

export default TimeFrame;
