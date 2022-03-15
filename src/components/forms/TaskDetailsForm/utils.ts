import dayjs from 'dayjs';
import {
  AnyTaskTypeConfig,
  CollectDemographicsConfig,
  ShareLinkConfig,
  TASK_TYPE,
  VisitLinkConfig,
  WatchVideoConfig,
  ZetkinTaskRequestBody,
} from 'types/tasks';

export const isPublishedFirst = (values: ZetkinTaskRequestBody): boolean => {
  const [publishedTime, deadlineTime, expiresTime] = [
    dayjs(values?.published),
    dayjs(values?.deadline),
    dayjs(values?.expires),
  ];

  return Boolean(
    !values?.published ||
      // If neither has a value, it's first
      (!values?.deadline && !values?.expires) ||
      // And it's is before deadline
      ((!values.deadline ||
        (values?.published && publishedTime.isBefore(deadlineTime))) &&
        // And it is before expires
        (!values.expires ||
          (values?.published && publishedTime.isBefore(expiresTime))))
  );
};

export const isDeadlineSecond = (values: ZetkinTaskRequestBody): boolean => {
  const [publishedTime, deadlineTime, expiresTime] = [
    dayjs(values?.published),
    dayjs(values?.deadline),
    dayjs(values?.expires),
  ];

  return Boolean(
    !values?.deadline ||
      // If neither has a value, it's fine
      (!values?.published && !values?.expires) ||
      // If is after published
      ((!values.published ||
        (values?.deadline && deadlineTime.isAfter(publishedTime))) &&
        // And it is before expires
        (!values.expires ||
          (values?.deadline && deadlineTime.isBefore(expiresTime))))
  );
};

export const isExpiresThird = (values: ZetkinTaskRequestBody): boolean => {
  const [publishedTime, deadlineTime, expiresTime] = [
    dayjs(values?.published),
    dayjs(values?.deadline),
    dayjs(values?.expires),
  ];

  return Boolean(
    !values?.expires ||
      // If neither has a value, it's fine
      (!values?.published && !values?.deadline) ||
      // If is after published
      ((!values.published ||
        (values?.expires && expiresTime.isAfter(publishedTime))) &&
        // And it is after deadline
        (!values.deadline ||
          (values?.expires && expiresTime.isAfter(deadlineTime))))
  );
};

/**
 * Returns a task config object with only the fields which exist on that type's config, and only fields with values
 */
export const configForTaskType = (
  type?: TASK_TYPE,
  config?: AnyTaskTypeConfig
): AnyTaskTypeConfig => {
  if (type === undefined || config === undefined) {
    return {};
  }

  if (type === TASK_TYPE.COLLECT_DEMOGRAPHICS) {
    const collectDemographicsConfig = config as CollectDemographicsConfig;
    return {
      ...(collectDemographicsConfig.fields && {
        fields: collectDemographicsConfig.fields,
      }),
    };
  }

  if (type === TASK_TYPE.SHARE_LINK) {
    const shareLinkConfig = config as ShareLinkConfig;
    return {
      ...(shareLinkConfig.url && { url: shareLinkConfig.url }),
      ...(shareLinkConfig.default_message && {
        default_message: shareLinkConfig.default_message,
      }),
    };
  }

  if (type === TASK_TYPE.VISIT_LINK) {
    const visitLinkConfig = config as VisitLinkConfig;
    return {
      ...(visitLinkConfig.url && { url: visitLinkConfig.url }),
    };
  }

  if (type === TASK_TYPE.WATCH_VIDEO) {
    const watchVideoConfig = config as WatchVideoConfig;
    return {
      ...(watchVideoConfig.url && { url: watchVideoConfig.url }),
    };
  }

  return {};
};
