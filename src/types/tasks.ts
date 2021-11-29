import { ZetkinQuery, ZetkinSmartSearchFilter } from './smartSearch';

export enum TASK_TYPE {
    COLLECT_DEMOGRAPHICS = 'demographic',
    OFFLINE = 'offline',
    SHARE_LINK = 'share_link',
    SHARE_IMAGE = 'share_image',
    VISIT_LINK = 'visit_link',
    WATCH_VIDEO = 'watch_video',
}

export interface ShareLinkConfig {
    default_message?: string;
    url?: string;
}

export interface VisitLinkConfig {
    url?: string;
}

export interface WatchVideoConfig {
    url?: string;
}

export enum DEMOGRAPHICS_FIELD {
    EMAIL= 'email',
    STREET_ADDRESS= 'street_address',
    CITY= 'city',
    COUNTRY= 'country',
    ZIP_CODE= 'zip_code',
}

export interface CollectDemographicsConfig {
    fields?: DEMOGRAPHICS_FIELD[];
}

export type AnyTaskTypeConfig = ShareLinkConfig | VisitLinkConfig | CollectDemographicsConfig | Record<string, never>;

// Task object from backend
export interface ZetkinTask<TaskTypeConfig = AnyTaskTypeConfig> {
    id: number;
    title: string;
    instructions: string;
    published?: string; // iso string
    expires?: string; // iso string
    deadline?: string; // iso string
    time_estimate?: number | null; // Time in minutes to complete
    type: TASK_TYPE;
    config: TaskTypeConfig;
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

// POST and PUT requests use this data shape
export interface ZetkinTaskRequestBody<Config = AnyTaskTypeConfig> extends
    Partial<
        Omit< // Remove these fields
            ZetkinTask<Config>,
            'campaign' |
            'organization' |
            'target'
        >
    >
    {
        campaign_id?: number;
        organization_id?: number;
        target_filters?: ZetkinSmartSearchFilter[];
    }

// Required fields for creating a task, all others are optional
export interface ZetkinTaskPostBody extends ZetkinTaskRequestBody {
    campaign_id: number;
    instructions: string;
    title: string;
    type: TASK_TYPE;
}

export enum ASSIGNED_STATUS {
    ASSIGNED='assigned',
    COMPLETED='completed',
    EXPIRED='expired',
    OVERDUE = 'overdue',
    IGNORED = 'ignored',
}

export interface TaskAssignee {
    first_name: string;
    id: number;
    last_name: string;
}

export interface ZetkinAssignedTask {
    id: number;
    status: ASSIGNED_STATUS;
    task: Pick<ZetkinTask, 'id' | 'deadline' | 'expires' | 'title'>;
    completed: string | null;
    assignee:TaskAssignee;
    assigned: string;
    ignored: string | null;
}
