
export enum FILTER_TYPE {
    ALL ='all',
    CAMPAIGN_PARTICIPATION = 'campaign_participation',
    MOST_ACTIVE ='most_active',
    RANDOM = 'random',
    SURVEY_SUBMISSION = 'survey_submission',
    USER = 'user'
}

export enum OPERATION {
    ADD = 'add',
    SUB = 'sub'
}

export enum QUANTITY {
    INT = 'integer',
    PERCENT = 'percent'
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
export type DefaultFilterConfig = Record<string, never> // Default filter config is an empty object

export interface MostActiveFilterConfig {
    after?: string;
    before?: string;
    size: number;
}

export interface RandomFilterConfig {
    size: number;
    seed: string;
}

export interface SurveySubmissionFilterConfig {
    after?: string;
    before?: string;
    operator: 'submitted';
    survey: number;
}

export interface UserFilterConfig {
    is_user: boolean;
}

export interface CampaignParticipationConfig {
    state: 'booked' | 'signed_up';
    operator: 'in' | 'notin';
    campaign?: number;
    activity?: number;
    location?: number;
    after?: string;
    before?: string;
}

export type AnyFilterConfig = (
    CampaignParticipationConfig |
    DefaultFilterConfig |
    MostActiveFilterConfig |
    RandomFilterConfig |
    SurveySubmissionFilterConfig |
    UserFilterConfig
    ) // Add all filter objects here

/** Filters */
export interface ZetkinSmartSearchFilter<C = AnyFilterConfig> {
    config: C;
    op: OPERATION;
    type: FILTER_TYPE;
}

export interface SmartSearchFilterWithId<C = AnyFilterConfig> extends ZetkinSmartSearchFilter<C> {
    id: number;
}

export interface NewSmartSearchFilter {
    type: FILTER_TYPE;
}

// Used for `selectedFilter` handling
export type SelectedSmartSearchFilter<C = AnyFilterConfig> =
    SmartSearchFilterWithId<C> | // When existing filter is being edited
    NewSmartSearchFilter | // When a new filter is being created
    null // When no filter selected
