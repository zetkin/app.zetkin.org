import {
  CallerParticipationFilterConfig,
  MATCHING,
} from 'features/smartSearch/components/types';

export const getLoggedCallCountWithConfig = (
  config: CallerParticipationFilterConfig['num_calls']
) => {
  const max = config?.max;
  const min = config?.min;

  if (min === 1 && max === undefined) {
    return {
      config,
      option: MATCHING.ONCE,
    };
  }

  if (min !== undefined && max !== undefined) {
    return {
      config,
      option: MATCHING.BETWEEN,
    };
  }

  if (min !== undefined) {
    return {
      config,
      option: MATCHING.MIN,
    };
  }

  if (max !== undefined) {
    return {
      config,
      option: MATCHING.MAX,
    };
  }

  return {
    config: { min: 1 },
    option: MATCHING.ONCE,
  };
};
