import { QUANTITY, TIME_FRAME } from 'types/smartSearch';

interface timeFrameConfig {
    after?: Date;
    before?: Date;
    numDays?: number;
    timeFrame: TIME_FRAME;
}

interface QuantityConfig {
    quantity: QUANTITY;
    size: number;
}

export const getTimeFrameWithConfig = (config: {after?: string; before?: string }): timeFrameConfig => {
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
