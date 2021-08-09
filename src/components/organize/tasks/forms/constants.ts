// Fields on the ZetkinTask model which are modified in the TaskDetailsForm
export enum TASK_DETAILS_FIELDS {
    TITLE= 'title',
    TYPE= 'type',
    CAMPAIGN_ID= 'campaign_id',
    INSTRUCTIONS= 'instructions',
    PUBLISHED= 'published',
    DEADLINE= 'deadline',
    EXPIRES= 'expires',
}

export enum SHARE_LINK_FIELDS {
    DEFAULT_MESSAGE= 'config.default_message',
    URL= 'config.url'
}

export enum VISIT_LINK_FIELDS {
    URL= 'config.url'
}

export enum COLLECT_DEMOGRAPHICS_FIELDS {
    FIELDS= 'config.fields'
}
