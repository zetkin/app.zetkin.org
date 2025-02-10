import { Household } from '../types';
import getAreaData from './getAreaData';

describe('getAreasData()', () => {
  it('returns an empty array for empty input', () => {
    const endDate = new Date();
    const idOfMetricThatDefinesDone = '2';
    const households: Household[] = [];
    const startDate = new Date();
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );

    expect(output).toEqual([]);
  });
  it('returns an empty array if startDate is after endDate', () => {
    const endDate = new Date('2024-10-14T13:00:00.000Z');
    const idOfMetricThatDefinesDone = '2';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '1',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '11', response: 'no' }],
            timestamp: '2024-10-14T12:00:00.000Z',
          },
        ],
      },
    ];
    const startDate = new Date();
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );

    expect(output).toEqual([]);
  });
  it('returns correct numbers for 1 household', () => {
    const idOfMetricThatDefinesDone = '2';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '1',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '11', response: 'no' }],
            timestamp: '2024-10-14T12:00:00.000Z',
          },
        ],
      },
    ];
    const startDate = new Date('2024-10-14T11:00:00.000Z');
    const endDate = new Date('2024-10-14T13:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '2024-10-14',
        hour: '11:00',
        householdVisits: 0,
        successfulVisits: 0,
      },
      {
        date: '2024-10-14',
        hour: '12:00',
        householdVisits: 1,
        successfulVisits: 0,
      },
      {
        date: '2024-10-14',
        hour: '13:00',
        householdVisits: 1,
        successfulVisits: 0,
      },
    ]);
  });
  it('returns correct numbers for 1 household with 1 non-succesful visit', () => {
    const idOfMetricThatDefinesDone = '2';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '1',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '11', response: 'no' }],
            timestamp: '2024-10-14T12:00:00.000Z',
          },
        ],
      },
    ];
    const startDate = new Date('2024-10-13T11:00:00.000Z');
    const endDate = new Date('2024-10-14T13:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '2024-10-13',
        hour: '0',
        householdVisits: 0,
        successfulVisits: 0,
      },
      {
        date: '2024-10-14',
        hour: '0',
        householdVisits: 1,
        successfulVisits: 0,
      },
    ]);
  });
  it('returns correct numbers for 1 household with 1 successful visit', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '1',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-14T12:00:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-10-14T13:00:00.000Z');
    const startDate = new Date('2024-10-13T11:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );

    expect(output).toEqual([
      {
        date: '2024-10-13',
        hour: '0',
        householdVisits: 0,
        successfulVisits: 0,
      },
      {
        date: '2024-10-14',
        hour: '0',
        householdVisits: 1,
        successfulVisits: 1,
      },
    ]);
  });
  it('returns correct number for 2 households with 2 successful visits in two different days', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '1',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-13T12:00:00.000Z',
          },
        ],
      },
      {
        id: '2',
        title: 'household 2',
        visits: [
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-11T12:00:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-10-13T13:00:00.000Z');
    const startDate = new Date('2024-10-11T11:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );

    expect(output).toEqual([
      {
        date: '2024-10-11',
        hour: '0',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-12',
        hour: '0',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-13',
        hour: '0',
        householdVisits: 2,
        successfulVisits: 2,
      },
    ]);
  });
  it('return correct numbers and returns missing dates entries for days without any visit', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '1',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'no' }],
            timestamp: '2024-10-13T13:00:00.000Z',
          },
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-11T11:00:00.000Z',
          },
          {
            areaAssId: '1',
            id: '3',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-11T13:00:00.000Z',
          },
        ],
      },
      {
        id: '2',
        title: 'household 2',
        visits: [
          {
            areaAssId: '1',
            id: '4',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-14T12:00:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-10-14T13:00:00.000Z');
    const startDate = new Date('2024-10-11T11:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );

    expect(output).toEqual([
      {
        date: '2024-10-11',
        hour: '0',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-12',
        hour: '0',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-13',
        hour: '0',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-14',
        hour: '0',
        householdVisits: 2,
        successfulVisits: 2,
      },
    ]);
  });
  it('returns value 0 for hour if startDate and endDate are not in the range of 24 hours', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-13T11:00:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-10-15T08:00:00.000Z');
    const startDate = new Date('2024-10-13T10:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '2024-10-13',
        hour: '0',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-14',
        hour: '0',
        householdVisits: 1,
        successfulVisits: 1,
      },
    ]);
  });
  it('returns correct numbers for 1 household with 1 successful visits in the range of 24h first hours ', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-13T12:00:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-10-13T13:00:00.000Z');
    const startDate = new Date('2024-10-13T10:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '2024-10-13',
        hour: '10:00',
        householdVisits: 0,
        successfulVisits: 0,
      },
      {
        date: '2024-10-13',
        hour: '11:00',
        householdVisits: 0,
        successfulVisits: 0,
      },
      {
        date: '2024-10-13',
        hour: '12:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-13',
        hour: '13:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
    ]);
  });
  it('returns correct numbers if there are only some visits every hour in the 24h first hours ', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-13T12:00:00.000Z',
          },
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-13T15:00:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-10-13T15:00:00.000Z');
    const startDate = new Date('2024-10-13T10:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '2024-10-13',
        hour: '10:00',
        householdVisits: 0,
        successfulVisits: 0,
      },
      {
        date: '2024-10-13',
        hour: '11:00',
        householdVisits: 0,
        successfulVisits: 0,
      },
      {
        date: '2024-10-13',
        hour: '12:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-13',
        hour: '13:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-13',
        hour: '14:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-13',
        hour: '15:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
    ]);
  });
  it('returns correct numbers when several visits happens in the same hour', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-14T09:10:00.000Z',
          },
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-14T09:10:00.000Z',
          },
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-14T09:35:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-10-14T11:00:00.000Z');
    const startDate = new Date('2024-10-14T08:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '2024-10-14',
        hour: '08:00',
        householdVisits: 0,
        successfulVisits: 0,
      },
      {
        date: '2024-10-14',
        hour: '09:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-14',
        hour: '10:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-14',
        hour: '11:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
    ]);
  });
  it('returns correct numbers for visits that occurs in hours across different days', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-14T00:10:00.000Z',
          },
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-14T00:20:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-10-14T01:00:00.000Z');
    const startDate = new Date('2024-10-13T23:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '2024-10-13',
        hour: '23:00',
        householdVisits: 0,
        successfulVisits: 0,
      },
      {
        date: '2024-10-14',
        hour: '00:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-14',
        hour: '01:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
    ]);
  });
  it('returns correct numbers for visits that occurs in the hours range across different months', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-31T23:10:00.000Z',
          },
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-11-01T00:20:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-11-01T02:00:00.000Z');
    const startDate = new Date('2024-10-31T23:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '2024-10-31',
        hour: '23:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-11-01',
        hour: '00:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-11-01',
        hour: '01:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-11-01',
        hour: '02:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
    ]);
  });
  it('returns correct numbers when the same household is visited more than once', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '1',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-31T23:10:00.000Z',
          },
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-11-01T00:20:00.000Z',
          },
        ],
      },
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '3',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-31T01:10:00.000Z',
          },
          {
            areaAssId: '1',
            id: '4',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-11-01T00:20:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-11-01T02:00:00.000Z');
    const startDate = new Date('2024-10-31T23:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '2024-10-31',
        hour: '23:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-11-01',
        hour: '00:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-11-01',
        hour: '01:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-11-01',
        hour: '02:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
    ]);
  });
  it('returns correct numbers when there are not unique households is visited more than once in hours range', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '1',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-31T23:10:00.000Z',
          },
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-11-01T00:20:00.000Z',
          },
        ],
      },
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '1',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-31T23:10:00.000Z',
          },
        ],
      },
      {
        id: '2',
        title: 'household 2',
        visits: [
          {
            areaAssId: '1',
            id: '3',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-31T01:10:00.000Z',
          },
          {
            areaAssId: '1',
            id: '4',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-11-01T00:20:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-11-01T02:00:00.000Z');
    const startDate = new Date('2024-10-31T23:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '2024-10-31',
        hour: '23:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-11-01',
        hour: '00:00',
        householdVisits: 2,
        successfulVisits: 2,
      },
      {
        date: '2024-11-01',
        hour: '01:00',
        householdVisits: 2,
        successfulVisits: 2,
      },
      {
        date: '2024-11-01',
        hour: '02:00',
        householdVisits: 2,
        successfulVisits: 2,
      },
    ]);
  });
  it('returns correct numbers when there are not unique households is visited more than once in days range instead of hours', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '1',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-31T23:10:00.000Z',
          },
          {
            areaAssId: '1',
            id: '2',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-11-01T00:20:00.000Z',
          },
        ],
      },
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            areaAssId: '1',
            id: '1',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-31T23:10:00.000Z',
          },
        ],
      },
      {
        id: '2',
        title: 'household 2',
        visits: [
          {
            areaAssId: '1',
            id: '3',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-31T01:10:00.000Z',
          },
          {
            areaAssId: '1',
            id: '4',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-11-01T00:20:00.000Z',
          },
        ],
      },
      {
        id: '3',
        title: 'household 3',
        visits: [
          {
            areaAssId: '1',
            id: '3',
            noteToOfficial: null,
            personId: 1,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-11-01T01:10:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-11-02T23:00:00.000Z');
    const startDate = new Date('2024-10-31T23:00:00.000Z');
    const output = getAreaData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '2024-10-31',
        hour: '0',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-11-01',
        hour: '0',
        householdVisits: 3,
        successfulVisits: 3,
      },
      {
        date: '2024-11-02',
        hour: '0',
        householdVisits: 3,
        successfulVisits: 3,
      },
    ]);
  });
});
