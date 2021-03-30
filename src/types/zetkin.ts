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
    respone_date: string;
    person: {
        name: string;
        id: number;
    };
    id: number;
}