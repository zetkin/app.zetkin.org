export interface ZetkinMembership {
    organization: ZetkinOrganization;
    profile: {
        id: number;
        name: string;
    };
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
    end_time: string;
    id: number;
    info_text: string;
    location: {
        id: number;
        lat: number;
        lng: number;
        title: string;
    };
    start_time: string;
    title?: string;
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

export interface ZetkinSession {
    created: string;
    level: number;
    user: ZetkinUser;
}

export interface ZetkinSurvey {
    elements: ZetkinSurveyElement[];
    info_text: string;
    title: string;
}

export type ZetkinSurveyElement = ZetkinSurveyQuestionElement | ZetkinSurveyTextblockElement;

export interface ZetkinSurveyQuestionElement {
    id: number;
    type: 'question';
    question: ZetkinSurveyQuestion;
}

export interface ZetkinSurveyTextblockElement {
    id: number;
    type: 'text';
    text_block: ZetkinSurveyTextblock;
}

export interface ZetkinSurveyTextblock {
    content: string;
    header: string;
}

export interface ZetkinSurveyQuestion {
    description?: string;
    question: string;
    response_config: {
        multiline: boolean;
    };
}
