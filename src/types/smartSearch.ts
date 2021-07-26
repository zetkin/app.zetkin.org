
export enum FILTER_TYPE {
    ALL ='all',
    MOST_ACTIVE ='most_active',
}

export enum OPERATION {
    ADD = 'add',
    SUB = 'sub'
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

/**
 * Filter Configs
 */
export type FilterConfig = Record<string, unknown> // Filter Configs are objects

export type DefaultFilterConfig = Record<string, never> // Default filter config is an empty object

export interface MostActiveFilterConfig extends FilterConfig {
    after?: string;
    before?: string;
    size?: number;
}

export type AnyFilterConfig = DefaultFilterConfig | MostActiveFilterConfig // Add all filter objects here

/** Filters */
export interface ZetkinSmartSearchFilter<C extends FilterConfig = AnyFilterConfig> {
    config?: C;
    op: OPERATION;
    type: FILTER_TYPE;
}

export interface SmartSearchFilterWithId<C extends FilterConfig = AnyFilterConfig> extends ZetkinSmartSearchFilter<C> {
    id: number;
}

export interface NewSmartSearchFilter {
    type: FILTER_TYPE;
}

// Used for `selectedFilter` handling
export type SelectedSmartSearchFilter<C extends FilterConfig = AnyFilterConfig> =
    SmartSearchFilterWithId<C> | // When existing filter is being edited
    NewSmartSearchFilter | // When a new filter is being created
    null // When no filter selected
