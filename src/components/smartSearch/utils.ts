import { MATCHING, QUANTITY, TASK_STATUS, TaskFilterConfig, TIME_FRAME } from 'types/smartSearch';

interface TimeFrameConfig {
    after?: Date;
    before?: Date;
    numDays?: number;
    timeFrame: TIME_FRAME;
}

interface QuantityConfig {
    quantity: QUANTITY;
    size: number;
}

interface MatchingConfig {
    min?: number;
    max?: number;
}

export const getTimeFrameWithConfig = (config: {after?: string; before?: string }): TimeFrameConfig => {
    const { after, before } = config;
    if (after && after.slice(0, 1) === '-') {
        return {
            numDays: +after.substring(1, after.length - 1),
            timeFrame:TIME_FRAME.LAST_FEW_DAYS,
        };
    }
    if (after === 'now') {
        return { timeFrame: TIME_FRAME.FUTURE };
    }
    else if (before === 'now') {
        return { timeFrame: TIME_FRAME.BEFORE_TODAY };
    }
    else if (after && before) {
        return {
            after: new Date(after),
            before: new Date(before),
            timeFrame: TIME_FRAME.BETWEEN,
        };
    }
    else if (after && !before) {
        return {
            after: new Date(after),
            timeFrame: TIME_FRAME.AFTER_DATE };
    }
    else if (!after && before) {
        return {
            before: new Date(before),
            timeFrame: TIME_FRAME.BEFORE_DATE,
        };
    }
    return { timeFrame: TIME_FRAME.EVER };
};

export const getQuantityWithConfig = (size: number): QuantityConfig => {
    if (size % 1 === 0) {
        return {
            quantity: QUANTITY.INT,
            size,
        };
    }
    return {
        quantity: QUANTITY.PERCENT,
        size: size * 100,
    };
};

export const getMatchingWithConfig = (config?: { max?: number; min?: number  }) : { config?: MatchingConfig; option: MATCHING } => {
    const max = config?.max;
    const min = config?.min;

    if (min != undefined && max != undefined) {
        return {
            config: config,
            option: MATCHING.BETWEEN,
        };
    }
    if (min != undefined) {
        return {
            config,
            option: MATCHING.MIN,
        };
    }
    if (max != undefined) {
        return {
            config,
            option: MATCHING.MAX,
        };
    }

    return {
        config: {},
        option: MATCHING.ONCE,
    };
};

export const getTaskStatus = (config : TaskFilterConfig) : TASK_STATUS => {
    if (config.assigned) {
        return TASK_STATUS.ASSIGNED;
    }
    else if (config.ignored) {
        return TASK_STATUS.IGNORED;
    }
    else if (config.completed) {
        return TASK_STATUS.COMPLETED;
    }
    else {
        throw 'Unknown task status';
    }
};

export const getTaskTimeFrame = (config : TaskFilterConfig) : { after?: string; before?: string } => {
    let timeFrame;
    if (config.assigned) {
        timeFrame = config.assigned;
    }
    else if (config.ignored) {
        timeFrame = config.ignored;
    }
    else if (config.completed) {
        timeFrame = config.completed;
    }
    else {
        throw 'Unknown task status';
    }

    // The API specifies true to represent "ever", but the TimeFrame component expects an empty object
    return timeFrame === true ? {} : timeFrame;
};
