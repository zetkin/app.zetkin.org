import { ZetkinOrganization } from './zetkin';


export interface ZetkinView {
    id: number;
    title: string;
    description: string;
    created: string; // ISO Datetime
    owner: {
        id: number;
        name: string;
    };
    organization: ZetkinOrganization;
}

export interface ZetkinViewColumn {
    id: number;
    type: COLUMN_TYPE;
    title: string;
    description?: string;
    config?: ViewColumnConfig;
}

export interface ZetkinViewRow {
    id: number;
    content: unknown[];
}

export enum COLUMN_TYPE {
    LOCAL_BOOL = 'local_bool',
    LOCAL_PERSON = 'local_person',
    PERSON_FIELD = 'person_field',
    PERSON_NOTES = 'person_notes',
    PERSON_QUERY = 'person_query',
    PERSON_TAG = 'person_tag',
    SURVEY_RESPONSE = 'survey_response',
    SURVEY_SUBMITTED = 'survey_submitted',
}

export interface PersonFieldViewColumnConfig {
    field: string;
}

export interface PersonQueryViewColumnConfig {
    query_id: number;
}

export type EmptyViewColumnConfig = Record<string,never>;

export type ViewColumnConfig = EmptyViewColumnConfig | PersonFieldViewColumnConfig | PersonQueryViewColumnConfig;
