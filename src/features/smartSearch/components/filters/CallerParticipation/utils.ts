import {
  CallerParticipationFilterConfig,
  MATCHING,
} from 'features/smartSearch/components/types';

const MIN_CALL_COUNT = 1;

export const normalizeLoggedCallCountConfig = (
  config: CallerParticipationFilterConfig['num_calls']
) => {
  const min =
    config.min !== undefined ? Math.max(MIN_CALL_COUNT, config.min) : undefined;
  const max =
    config.max !== undefined ? Math.max(MIN_CALL_COUNT, config.max) : undefined;

  if (min !== undefined && max !== undefined && max < min) {
    return {
      max: min,
      min: max,
    };
  }

  return {
    max,
    min,
  };
};

export const getLoggedCallCountWithConfig = (
  config: CallerParticipationFilterConfig['num_calls']
) => {
  const { max, min } = normalizeLoggedCallCountConfig(config);

  if (min === 1 && max === undefined) {
    return {
      config: { min },
      option: MATCHING.ONCE,
    };
  }

  if (min !== undefined && max !== undefined) {
    return {
      config: { max, min },
      option: MATCHING.BETWEEN,
    };
  }

  if (min !== undefined) {
    return {
      config: { min },
      option: MATCHING.MIN,
    };
  }

  if (max !== undefined) {
    return {
      config: { max },
      option: MATCHING.MAX,
    };
  }

  return {
    config: { min: 1 },
    option: MATCHING.ONCE,
  };
};
