import getRelevantDataPoints from './getRelevantDataPoints';

describe('getRelevantDataPoints()', () => {
  it('returns exact point from main if secondary is null', () => {
    const input = {
      id: 'main.1',
    };

    const mainSeries = {
      startDate: new Date('1857-07-05T13:37:00.000Z'),
      values: [
        {
          accumulatedOpens: 123,
          date: '1857-07-05T13:37:00.000Z',
        },
        {
          accumulatedOpens: 125,
          date: '1857-07-05T13:38:00.000Z',
        },
      ],
    };

    const result = getRelevantDataPoints(input, mainSeries, null);

    expect(result.secondaryPoint).toBeNull();
    expect(result.mainPoint).toEqual(mainSeries.values[1]);
  });

  it('returns nearest preceding from secondary for main input', () => {
    const input = {
      id: 'main.1',
    };

    const mainSeries = {
      startDate: new Date('1857-07-05T13:37:00.000Z'),
      values: [
        {
          accumulatedOpens: 123,
          date: '1857-07-05T13:37:00.000Z',
        },
        {
          accumulatedOpens: 125,
          date: '1857-07-05T13:38:00.000Z',
        },
      ],
    };

    const secondarySeries = {
      startDate: new Date('1933-06-20T13:37:00.000Z'),
      values: [
        {
          accumulatedOpens: 123,
          date: '1933-06-20T13:37:00.000Z',
        },
        {
          accumulatedOpens: 125,
          date: '1933-06-20T13:39:00.000Z',
        },
      ],
    };

    const result = getRelevantDataPoints(input, mainSeries, secondarySeries);

    expect(result.mainPoint).toEqual(mainSeries.values[1]);
    expect(result.secondaryPoint).toEqual(secondarySeries.values[0]);
  });

  it('returns nearest preceding from secondary when main is in the past', () => {
    const input = {
      id: 'main.0',
    };

    const secondarySeries = {
      startDate: new Date('1857-07-05T13:37:00.000Z'),
      values: [
        {
          accumulatedOpens: 123,
          date: '1857-07-05T13:37:00.000Z',
        },
        {
          accumulatedOpens: 125,
          date: '1857-07-05T13:38:00.000Z',
        },
      ],
    };

    const mainSeries = {
      startDate: new Date('1933-06-20T13:37:00.000Z'),
      values: [
        {
          accumulatedOpens: 123,
          date: '1933-06-20T13:37:00.000Z',
        },
        {
          accumulatedOpens: 125,
          date: '1933-06-20T13:39:00.000Z',
        },
      ],
    };

    const result = getRelevantDataPoints(input, mainSeries, secondarySeries);

    expect(result.mainPoint).toEqual(mainSeries.values[0]);
    expect(result.secondaryPoint).toEqual(secondarySeries.values[0]);
  });

  it('returns nearest preceding from main for secondary input', () => {
    const input = {
      id: 'secondary.1',
    };

    const secondarySeries = {
      startDate: new Date('1933-06-20T13:37:00.000Z'),
      values: [
        {
          accumulatedOpens: 123,
          date: '1933-06-20T13:37:00.000Z',
        },
        {
          accumulatedOpens: 125,
          date: '1933-06-20T13:38:00.000Z',
        },
      ],
    };

    const mainSeries = {
      startDate: new Date('1857-07-05T13:37:00.000Z'),
      values: [
        {
          accumulatedOpens: 123,
          date: '1857-07-05T13:37:00.000Z',
        },
        {
          accumulatedOpens: 125,
          date: '1857-07-05T13:39:00.000Z',
        },
      ],
    };

    const result = getRelevantDataPoints(input, mainSeries, secondarySeries);

    expect(result.secondaryPoint).toEqual(secondarySeries.values[1]);
    expect(result.mainPoint).toEqual(mainSeries.values[0]);
  });

  it('returns last from secondary if main exceeds duration', () => {
    const input = {
      id: 'main.1',
    };

    const mainSeries = {
      startDate: new Date('1857-07-05T13:37:00.000Z'),
      values: [
        {
          accumulatedOpens: 123,
          date: '1857-07-05T13:37:00.000Z',
        },
        {
          accumulatedOpens: 125,
          date: '1857-07-05T14:37:00.000Z', // 1 hour later
        },
      ],
    };

    const secondarySeries = {
      startDate: new Date('1933-06-20T13:37:00.000Z'),
      values: [
        {
          accumulatedOpens: 123,
          date: '1933-06-20T13:37:00.000Z',
        },
      ],
    };

    const result = getRelevantDataPoints(input, mainSeries, secondarySeries);

    expect(result.mainPoint).toEqual(mainSeries.values[1]);
    expect(result.secondaryPoint).toEqual(secondarySeries.values[0]);
  });
});
