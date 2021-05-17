export interface ZetkinCampaign {
    info_text: string;
    title: string;
    id: string;
}

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
    respond?: boolean;
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

export interface ZetkinSurveyTextQuestion {
    description?: string;
    question: string;
    response_config: {
        multiline: boolean;
    };
    response_type: 'text';
    required?: boolean;
}

export interface ZetkinSurveyOptionsQuestion {
    description?: string;
    options: {
        id: number;
        text: string;
    }[];
    question: string;
    response_config: {
        widget_type: string;
    };
    response_type: 'options';
    required?: boolean;
}

export type ZetkinSurveyQuestion = ZetkinSurveyTextQuestion | ZetkinSurveyOptionsQuestion;

export interface ZetkinSurveyTextQuestionElement {
    id: number;
    type: 'question';
    question: ZetkinSurveyTextQuestion;
}

export interface ZetkinSurveyOptionsQuestionElement {
    id: number;
    type: 'question';
    question: ZetkinSurveyOptionsQuestion;
}

export type ZetkinSurveyQuestionElement = ZetkinSurveyTextQuestionElement | ZetkinSurveyOptionsQuestionElement;

export interface ZetkinSurveyTextblockElement {
    id: number;
    type: 'text';
    text_block: ZetkinSurveyTextblock;
}

export interface ZetkinSurveyTextblock {
    content: string;
    header: string;
}

export type ZetkinSurveyElement = ZetkinSurveyQuestionElement | ZetkinSurveyTextblockElement;

export interface ZetkinSurvey {
    elements: ZetkinSurveyElement[];
    info_text: string;
    title: string;
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
