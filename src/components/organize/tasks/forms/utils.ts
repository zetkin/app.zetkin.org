import dayjs from 'dayjs';
import { ZetkinTaskRequestBody } from 'types/tasks';

export const isPublishedFirst = (values: ZetkinTaskRequestBody): boolean => {
    const [publishedTime, deadlineTime, expiresTime] = [dayjs(values?.published) ,dayjs(values?.deadline), dayjs(values?.expires)];

    return Boolean(
        !values?.published ||
        // If neither has a value, it's first
        (!values?.deadline && !values?.expires) ||
        // And it's is before deadline
        (!values.deadline ||values?.published && publishedTime.isBefore(deadlineTime)) &&
        // And it is before expires
        (!values.expires || values?.published && publishedTime.isBefore(expiresTime)),
    );
};

export const isDeadlineSecond = (values: ZetkinTaskRequestBody): boolean => {
    const [publishedTime, deadlineTime, expiresTime] = [dayjs(values?.published) ,dayjs(values?.deadline), dayjs(values?.expires)];

    return Boolean(
        !values?.deadline ||
        // If neither has a value, it's fine
        (!values?.published && !values?.expires) ||
        // If is after published
        (!values.published || values?.deadline && deadlineTime.isAfter(publishedTime)) &&
        // And it is before expires
        (!values.expires || values?.deadline && deadlineTime.isBefore(expiresTime)),
    );

};

export const isExpiresThird = (values: ZetkinTaskRequestBody): boolean => {
    const [publishedTime, deadlineTime, expiresTime] = [dayjs(values?.published) ,dayjs(values?.deadline), dayjs(values?.expires)];

    return Boolean(
        !values?.expires ||
        // If neither has a value, it's fine
        (!values?.published && !values?.deadline) ||
        // If is after published
        (!values.published || values?.expires && expiresTime.isAfter(publishedTime)) &&
        // And it is after deadline
        (!values.deadline || values?.expires && expiresTime.isAfter(deadlineTime)),
    );
};
