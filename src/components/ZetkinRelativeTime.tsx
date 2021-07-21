import dayjs from 'dayjs';
import { Tooltip } from '@material-ui/core';
import { FormattedDate, FormattedRelativeTime, FormattedTime } from 'react-intl';

interface ZetkinRelativeTimeProps {
    datetime: string; // iso datetime string
}

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
    const difference: number =  absoluteDatetime.unix() - now.unix();

    if (isNaN(difference)) {
        return null;
    }

    return (
        <Tooltip arrow title={ <DatetimeTooltipContents datetime={ datetime } /> }>
            <span>
                <FormattedRelativeTime numeric="auto" updateIntervalInSeconds={ 300 } value={ difference } />
            </span>
        </Tooltip>
    );
};

export default ZetkinRelativeTime;
