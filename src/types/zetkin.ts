import { ZetkinSmartSearchFilter } from './smartSearch';

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
    goal: {
        filter_spec: undefined;
        id: number;
        type: string;
    };
    id: number;
    instructions: string;
    organization: {
        id: number;
        title: string;
    };
    organization_id: number;
    start_date: string;
    target: {
        filter_spec: [
            {
                config: {
                    after: string;
                    campaign: number;
                    operator: string;
                };
                type: string;
            }
        ];
        id: number;
        type: string;
    };
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
    options?: Array<unknown>;
    question: string;
    required: boolean;
    response_config: {
        multiline: boolean;
    };
    response_type: RESPONSE_TYPE;
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

//  Tasks
export enum ZetkinTaskType {
    demographic = 'demographic',
    offline = 'offline',
    share_link = 'share_link',
    share_image = 'share_image',
    visit_link = 'visit_link',
    watch_video = 'watch_video',
}

export interface ZetkinQuery {
    filter_spec: ZetkinSmartSearchFilter[];
    id: number;
}

export interface ZetkinTask {
    id: number;
    title: string;
    instructions: string;
    published?: string; // iso string
    expires?: string; // iso string
    deadline?: string; // iso string
    type: ZetkinTaskType;
    config: Record<string, unknown >; // Will find out configs for different types later
    target: ZetkinQuery;
    campaign: {
        id: number;
        title: string;
    };
    organization: {
        id: number;
        title: string;
    };
}

export interface ZetkinTaskReqBody extends Partial<ZetkinTask> {
    title: string;
    instructions: string;
    type: ZetkinTaskType;
    campaign_id: number;
    target_filters: ZetkinSmartSearchFilter[];
}

export interface ZetkinTag {
    id: number;
    title: string;
    hidden: boolean;
    description: string;
}
