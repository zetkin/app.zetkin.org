export interface ZetkinMembership {
    organization: {
        id: number;
        title: string;
    };
    profile: {
        id: number;
    };
}

export interface ZetkinEventResponse {
    action_id: number;
    response_date: string;
    person: {
        name: string;
        id: number;
    };
    id: number;
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
    location: { title: string };
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