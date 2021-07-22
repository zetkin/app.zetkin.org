import { TIME_FRAME } from 'types/smartSearch';
import { ZetkinSmartSearchFilter } from 'types/zetkin';
import { ZetkinSmartSearchFilterWithId } from 'types/smartSearch';

export function isFilterWithId(filter: ZetkinSmartSearchFilterWithId | ZetkinSmartSearchFilter): filter is ZetkinSmartSearchFilterWithId {
    return (filter as ZetkinSmartSearchFilterWithId).id !== undefined;
}

export const getTimeFrame = (config: {after?: string; before?: string }): TIME_FRAME => {
    const { after, before } = config;
    if (after && after.slice(0, 1) === '-') {
        return TIME_FRAME.LAST_FEW_DAYS;
    }
    if (after === 'now') {
        return TIME_FRAME.FUTURE;
    }
    else if (before === 'now') {
        return TIME_FRAME.BEFORE_TODAY;
    }
    else if (after && before) {
        return TIME_FRAME.BETWEEN;
    }
    else if (after && !before) {
        return TIME_FRAME.AFTER_DATE;
    }
    else if (!after && before) {
        return TIME_FRAME.BEFORE_DATE;
    }
    return TIME_FRAME.EVER;
};
