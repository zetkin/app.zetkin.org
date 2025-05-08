import summarizeMetrics from './summarizeMetrics';

describe('summarizeMetrics()', () => {
  it('returns zeroes with empty list', () => {
    const output = summarizeMetrics([]);

    expect(output).toEqual({
      metrics: [],
      num_households_visited: 0,
    });
  });

  it('summarizes household count', () => {
    const output = summarizeMetrics([
      { household_id: 1, metrics: [] },
      { household_id: 2, metrics: [] },
    ]);

    expect(output).toEqual({
      metrics: [],
      num_households_visited: 2,
    });
  });

  it('counts unique households', () => {
    const output = summarizeMetrics([
      { household_id: 1, metrics: [] },
      { household_id: 2, metrics: [] },
      { household_id: 2, metrics: [] },
    ]);

    expect(output).toEqual({
      metrics: [],
      num_households_visited: 2,
    });
  });

  it('summarizes multiple yes/no metrics', () => {
    const output = summarizeMetrics([
      {
        household_id: 1,
        metrics: [
          { metric_id: 1, response: 'yes' },
          { metric_id: 2, response: 'yes' },
        ],
      },
      {
        household_id: 2,
        metrics: [
          { metric_id: 1, response: 'yes' },
          { metric_id: 2, response: 'no' },
        ],
      },
    ]);

    expect(output).toEqual({
      metrics: [
        {
          metric_id: 1,
          num_no: 0,
          num_yes: 2,
        },
        {
          metric_id: 2,
          num_no: 1,
          num_yes: 1,
        },
      ],
      num_households_visited: 2,
    });
  });

  it('summarizes multiple scale5 metrics', () => {
    const output = summarizeMetrics([
      {
        household_id: 1,
        metrics: [
          { metric_id: 1, response: 1 },
          { metric_id: 2, response: 3 },
        ],
      },
      {
        household_id: 2,
        metrics: [
          { metric_id: 1, response: 1 },
          { metric_id: 2, response: 2 },
        ],
      },
    ]);

    expect(output).toEqual({
      metrics: [
        {
          metric_id: 1,
          num_values: [2, 0, 0, 0, 0],
        },
        {
          metric_id: 2,
          num_values: [0, 1, 1, 0, 0],
        },
      ],
      num_households_visited: 2,
    });
  });
});
