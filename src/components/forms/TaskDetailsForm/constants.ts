// Fields on the ZetkinTask model which are modified in the TaskDetailsForm
export enum TASK_DETAILS_FIELDS {
  TITLE = 'title',
  TYPE = 'type',
  CAMPAIGN_ID = 'campaign_id',
  INSTRUCTIONS = 'instructions',
  PUBLISHED = 'published',
  DEADLINE = 'deadline',
  EXPIRES = 'expires',
  REASSIGN_INTERVAL = 'reassign_interval',
  REASSIGN_LIMIT = 'reassign_limit',
  TIME_ESTIMATE = 'time_estimate',
}

export const DEFAULT_TIME_ESTIMATE = 'noEstimate'; // Gets mapped to null when saving if this is selected value
export const DEFAULT_REASSIGN_INTERVAL = 'noInterval'; // Gets mapped to null when saving if this is selected value

export enum SHARE_LINK_FIELDS {
  DEFAULT_MESSAGE = 'config.default_message',
  URL = 'config.url',
}

export enum VISIT_LINK_FIELDS {
  URL = 'config.url',
}

export enum COLLECT_DEMOGRAPHICS_FIELDS {
  FIELDS = 'config.fields',
}

export enum WATCH_VIDEO_FIELDS {
  URL = 'config.url',
}
