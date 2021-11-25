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
    title: string;
    description?: string;
    type: string;
    config?: {
        field: string;
    };
}

export interface ZetkinViewRow {
    id: number;
    content: unknown[];
}
