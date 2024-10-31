import { m } from 'core/i18n';
import { GraphData, Household } from '../types';
import getAreasData from './getAreaData';

describe('getAreasData()', () => {
  it('returns an empty array for empty input', () => {
    const endDate = new Date();
    const idOfMetricThatDefinesDone = '2';
    const households: Household[] = [];
    const startDate = new Date();
    const output = getAreasData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );

    expect(output).toEqual([]);
  });
  it('returns correct numbers for 1 household with 1 non-succesful visit', () => {
    const idOfMetricThatDefinesDone = '2';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            canvassAssId: '1',
            id: '1',
            noteToOfficial: null,
            responses: [{ metricId: '11', response: 'no' }],
            timestamp: '2024-10-14T12:00:00.000Z',
          },
        ],
      },
    ];
    const startDate = new Date('2024-10-13T11:00:00.000Z');
    const endDate = new Date('2024-10-14T13:00:00.000Z');
    const output = getAreasData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      { date: '2024-10-13', householdVisits: 0, successfulVisits: 0 },
      {
        date: '2024-10-14',
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
            canvassAssId: '1',
            id: '1',
            noteToOfficial: null,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-14T12:00:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-10-14T13:00:00.000Z');
    const startDate = new Date('2024-10-13T11:00:00.000Z');
    const output = getAreasData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );

    expect(output).toEqual([
      { date: '2024-10-13', householdVisits: 0, successfulVisits: 0 },
      {
        date: '2024-10-14',
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
            canvassAssId: '1',
            id: '1',
            noteToOfficial: null,
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
            canvassAssId: '1',
            id: '2',
            noteToOfficial: null,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-11T12:00:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-10-13T13:00:00.000Z');
    const startDate = new Date('2024-10-11T11:00:00.000Z');
    const output = getAreasData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );

    expect(output).toEqual([
      {
        date: '2024-10-11',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-12',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '2024-10-13',
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
            canvassAssId: '1',
            id: '1',
            noteToOfficial: null,
            responses: [{ metricId: '1', response: 'no' }],
            timestamp: '2024-10-13T13:00:00.000Z',
          },
          {
            canvassAssId: '1',
            id: '2',
            noteToOfficial: null,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-11T11:00:00.000Z',
          },
          {
            canvassAssId: '1',
            id: '3',
            noteToOfficial: null,
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
            canvassAssId: '1',
            id: '4',
            noteToOfficial: null,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-14T12:00:00.000Z',
          },
        ],
      },
    ];
    const endDate = new Date('2024-10-14T13:00:00.000Z');
    const startDate = new Date('2024-10-11T11:00:00.000Z');
    const output = getAreasData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );

    expect(output).toEqual([
      {
        date: '2024-10-11',
        householdVisits: 2,
        successfulVisits: 2,
      },
      {
        date: '2024-10-12',
        householdVisits: 2,
        successfulVisits: 2,
      },
      {
        date: '2024-10-13',
        householdVisits: 3,
        successfulVisits: 2,
      },
      {
        date: '2024-10-14',
        householdVisits: 4,
        successfulVisits: 3,
      },
    ]);
  });
  it('returns correct numbers for 2 successful visits in the 24h first hours of the assignment', () => {
    const idOfMetricThatDefinesDone = '1';
    const households: Household[] = [
      {
        id: '1',
        title: 'household 1',
        visits: [
          {
            canvassAssId: '1',
            id: '1',
            noteToOfficial: null,
            responses: [{ metricId: '1', response: 'no' }],
            timestamp: '2024-10-11T13:00:00.000Z',
          },
          {
            canvassAssId: '1',
            id: '2',
            noteToOfficial: null,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-11T11:00:00.000Z',
          },
          {
            canvassAssId: '1',
            id: '3',
            noteToOfficial: null,
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
            canvassAssId: '1',
            id: '4',
            noteToOfficial: null,
            responses: [{ metricId: '1', response: 'yes' }],
            timestamp: '2024-10-11T12:00:00.000Z',
          },
        ],
      },
    ];
    //end date is the last visit of all areas?
    //24h last hours of the assignment? of the first visit?
    const endDate = new Date('2024-10-14T13:00:00.000Z');

    const startDate = new Date('2024-10-11T10:00:00.000Z');
    const output = getAreasData(
      endDate,
      households,
      startDate,
      idOfMetricThatDefinesDone
    );
    expect(output).toEqual([
      {
        date: '10:00',
        householdVisits: 0,
        successfulVisits: 0,
      },
      {
        date: '11:00',
        householdVisits: 1,
        successfulVisits: 1,
      },
      {
        date: '12:00',
        householdVisits: 2,
        successfulVisits: 2,
      },
      {
        date: '13:00',
        householdVisits: 4,
        successfulVisits: 3,
      },
    ]);
  });
});
