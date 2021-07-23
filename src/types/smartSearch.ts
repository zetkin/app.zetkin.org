
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

export interface ZetkinSmartSearchFilter {
    config?: {
        after?: string;
        before?: string;
        size?: number;
    };
    op: 'sub' | 'add';
    type: FILTER_TYPE;
}

export interface SmartSearchFilterWithId extends ZetkinSmartSearchFilter {
    id: number;
}

export interface NewSmartSearchFilter {
    type: FILTER_TYPE;
}

export type SelectedSmartSearchFilter =
    SmartSearchFilterWithId | // When existing filter is being edited
    NewSmartSearchFilter | // When a new filter is being created
    null // When no filter selected
