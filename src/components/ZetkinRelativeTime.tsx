import dayjs from 'dayjs';
import { FormattedDate, FormattedRelativeTime, FormattedTime } from 'react-intl';
import { Theme, Tooltip, withStyles } from '@material-ui/core';

interface ZetkinRelativeTimeProps {
    datetime: string; // iso datetime string
}

const DatetimeTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        fontSize: theme.typography.pxToRem(14),
    },
}))(Tooltip);

const DatetimeTooltipContents: React.FunctionComponent<ZetkinRelativeTimeProps> = ({ datetime }) => {
    return (
        <>
            <FormattedDate
                day="numeric"
                month="long"
                value={ datetime }
                year="numeric"
            />
            { ' ' }
            <FormattedTime
                value={ datetime }
            />
        </>
    );

};

const ZetkinRelativeTime: React.FunctionComponent<ZetkinRelativeTimeProps> = ({ datetime }) => {
    const now = dayjs();
    const absoluteDatetime = dayjs(datetime);
    // Time difference in epoch time
    const difference =  absoluteDatetime.unix() - now.unix();

    return (
        <DatetimeTooltip title={ <DatetimeTooltipContents datetime={ datetime } /> }>
            <span>
                <FormattedRelativeTime numeric="auto" updateIntervalInSeconds={ 0 } value={ difference } />
            </span>
        </DatetimeTooltip>
    );
};

export default ZetkinRelativeTime;
