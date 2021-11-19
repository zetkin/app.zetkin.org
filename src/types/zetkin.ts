import { ZetkinAssignedTask, ZetkinTask } from './tasks';
import { ZetkinQuery, ZetkinSmartSearchFilter } from './smartSearch';

export interface ZetkinCampaign {
    color: string;
    info_text: string;
    title: string;
    id: number;
    organization?: ZetkinOrganization;
    manager: null | {
        id: number;
        name: string;
    };
    visibility: string;
    published: boolean;
}

export interface ZetkinMembership {
    organization: ZetkinOrganization;
    follow?: boolean;
    profile: {
        id: number;
        name: string;
    };
    inherited?: false;
    role : string | null;
}

export interface ZetkinEventResponse {
    action_id: number;
    id: number;
    person: {
        id: number;
        name: string;
    };
    response_date: string;
}

export interface ZetkinEvent {
    activity: { title: string };
    campaign: {
        id: number;
        title: string;
    };
    contact?: string | null;
    end_time: string;
    id: number;
    info_text: string;
    location: {
        id: number;
        lat: number;
        lng: number;
        title: string;
    };
    num_participants_required?: number;
    num_participants_available?: number;
    start_time: string;
    title?: string;
    organization: {
        id: number;
        title: string;
    };
    userBooked?: boolean;
    userResponse?: boolean;
    url?: string;
}

export interface ZetkinUser {
    first_name: string;
    id: number;
    last_name: string;
    username: string;
}

export interface ZetkinOrganization {
    id: number;
    title: string;
}

export interface ZetkinPerson {
    alt_phone: string;
    is_user: boolean;
    zip_code: string;
    last_name: string;
    city: string;
    first_name: string;
    gender: string;
    street_address: string;
    co_address: string;
    ext_id: string;
    email: string;
    country: string;
    id: number;
    phone: string;
}

export interface ZetkinSession {
    created: string;
    level: number;
    user: ZetkinUser;
}

export interface ZetkinCallAssignment {
    cooldown: number;
    description: string;
    disable_caller_notes: boolean;
    end_date: string;
    goal: ZetkinQuery;
    id: number;
    instructions: string;
    organization: {
        id: number;
        title: string;
    };
    organization_id: number;
    start_date: string;
    target: ZetkinQuery;
    title: string;
}

export interface ZetkinSurvey {
    title: string;
    id: number;
    info_text: string;
    organization: {
        id: number;
        title: string;
    };
    allow_anonymous: boolean;
    access: string;
    callers_only: boolean;
}

export interface ZetkinSurveyExtended extends ZetkinSurvey {
    elements: ZetkinSurveyElement[];
}

export interface ZetkinSurveyElement {
    id: number;
    question: ZetkinQuestion;
    type: ELEMENT_TYPE;
}

export enum RESPONSE_TYPE {
    OPTIONS = 'options',
    TEXT = 'text'
}

export enum ELEMENT_TYPE {
    QUESTION = 'question',
    TEXT = 'text'
}

interface ZetkinQuestion {
    description: string | null;
    options?: ZetkinSurveyOption[];
    question: string;
    required: boolean;
    response_config: {
        multiline: boolean;
    };
    response_type: RESPONSE_TYPE;
}

export interface ZetkinSurveyOption {
    id: number;
    text: string;
}

export interface ZetkinCanvassAssignment {
    start_data: string;
    end_date: string;
    description: string;
    organization: {
        id: string;
        title: string;
    };
    instructions: string;
    id: string;
    title: string;
}

export interface ZetkinLocation {
    id: number;
    lat: number;
    lng: number;
    title: string;
    info_text: string;
}

export interface ZetkinActivity {
    id: number;
    title: string;
    info_text: string | null;
}

export interface ZetkinTag {
    id: number;
    title: string;
    hidden: boolean;
    description: string;
}

export enum CUSTOM_FIELD_TYPE {
    URL='url',
    DATE='date',
    TEXT='text',
    JSON='json'
}

export interface ZetkinDataField {
    id: number;
    title: string;
    description: string;
    type: CUSTOM_FIELD_TYPE;
    slug: string;
}

export type { ZetkinTask, ZetkinAssignedTask, ZetkinQuery, ZetkinSmartSearchFilter };

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
    title: string;
    // TODO: Add all fields when implementing proper support for column types
}

export interface ZetkinViewRow {
    id: number;
    content: unknown[];
}
