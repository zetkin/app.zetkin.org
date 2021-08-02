
export enum FILTER_TYPE {
    ALL ='all',
    CAMPAIGN_PARTICIPATION = 'campaign_participation',
    MOST_ACTIVE ='most_active',
    PERSON_DATA = 'person_data',
    RANDOM = 'random',
    SURVEY_RESPONSE = 'survey_response',
    SURVEY_SUBMISSION = 'survey_submission',
    USER = 'user'
}

export enum MATCH_OPERATORS {
    IN = 'in',
    NOT_IN = 'notin',
    EQUALS = 'eq',
    NOT_EQUALS = 'noteq',
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

export enum DATA_FIELD {
    FIRST_NAME = 'first_name',
    LAST_NAME = 'last_name',
    GENDER = 'gender',
    CITY = 'city',
    STREET_ADDRESS = 'street_address',
    CO_ADDRESS = 'co_address',
    ZIP_CODE = 'zip_code',
    PHONE = 'phone',
    ALT_PHONE = 'alt_phone'
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

export interface PersonDataFilterConfig {
    fields: {
        alt_phone?: string;
        city?: string;
        co_address?: string;
        first_name?: string;
        gender?: string;
        last_name?: string;
        phone?: string;
        street_address?: string;
        zip_code?: string;
    };
}

export interface RandomFilterConfig {
    size: number;
    seed: string;
}

export interface SurveyResponseFilterConfig {
    operator: MATCH_OPERATORS;
    value: string;
    question?: number;
    survey?: number;
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
    PersonDataFilterConfig |
    RandomFilterConfig |
    SurveyResponseFilterConfig |
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
