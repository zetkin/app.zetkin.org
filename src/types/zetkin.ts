export interface ZetkinCampaign {
    color: string;
    info_text: string;
    title: string;
    id: number;
    organization?: ZetkinOrganization;
    manager: string | null;
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
