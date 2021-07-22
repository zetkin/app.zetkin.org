import { ZetkinSmartSearchFilter } from './zetkin';

export interface ZetkinSmartSearchFilterWithId extends ZetkinSmartSearchFilter {
    id: number;
}

export enum FILTER_TYPE {
    ALL ='all',
    MOST_ACTIVE ='most_active',
}

export enum TIME_FRAME {
    EVER='ever',
    FUTURE='future',
    BEFORE_TODAY='beforeToday',
    BEFORE_DATE='beforeDate',
    AFTER_DATE='afterDate',
    BETWEEN='between',
    LAST_FEW_DAYS='lastFew',
}
