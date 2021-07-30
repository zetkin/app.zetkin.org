interface ZetkinSmartSearchFilter {
    config?: Record<string, unknown>;
    op: 'sub' | 'add';
    type: string;
}

export enum TASK_TYPE {
    DEMOGRAPHIC = 'demographic',
    OFFLINE = 'offline',
    SHARE_LINK = 'share_link',
    SHARE_IMAGE = 'share_image',
    VISIT_LINK = 'visit_link',
    WATCH_VIDEO = 'watch_video',
}

export interface ShareLinkConfig {
    default_message: string;
    url: string;
}

export interface OpenLinkConfig {
    url: string;
}

export type AnyTaskTypeConfig = ShareLinkConfig | OpenLinkConfig;

// Task object from backend
export interface ZetkinTask<TaskTypeConfig = AnyTaskTypeConfig> {
    id: number;
    title: string;
    instructions: string;
    published?: string; // iso string
    expires?: string; // iso string
    deadline?: string; // iso string
    type: TASK_TYPE;
    config: TaskTypeConfig;
    target: {
        filter_spec: ZetkinSmartSearchFilter[];
        id: number;
    };
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
