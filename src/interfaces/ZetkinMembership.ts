import { ZetkinOrganization } from './ZetkinOrganization';

export interface ZetkinMembership {
    role : string | null;
    organization: ZetkinOrganization;
    profile: {
        name: string;
        id: number;
    }; 
}