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
    location: { title: string };
    start_time: string;
    title?: string;
    organization?: {
        id: number;
        title: string;
    };
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

export interface ZetkinBookedEvent {
    activity: { id: number; title: string };
    campaign: { id: number; title: string };
    contact: string | null;
    end_time: string;
    id: number;
    info_text: string;
    location: { id: number; lat: number; lng: number; title: string };
    num_participants_required: number;
    num_participants_available: number;
    start_time: string;
    title: string | null;
}