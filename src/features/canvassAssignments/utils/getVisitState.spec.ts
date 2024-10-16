import getVisitState from './getVisitState';

describe('getVisitState()', () => {
  it('returns "pending" when passed an empty array', () => {
    const state = getVisitState([], '123');

    expect(state).toEqual('pending');
  });

  it('returns "pending" when passed an array where no housholds have visits in current assignment', () => {
    const state = getVisitState(
      [
        { id: '1', title: 'Door 1', visits: [] },
        {
          id: '2',
          title: 'Door 2',
          visits: [
            {
              canvassAssId: '345',
              id: 'a',
              noteToOfficial: '',
              responses: [],
              timestamp: '20230503',
            },
          ],
        },
      ],
      '123'
    );

    expect(state).toEqual('pending');
  });

  it('returns "started" when passed an array where only one household has visits in the current assignment', () => {
    const state = getVisitState(
      [
        { id: '1', title: 'Door 1', visits: [] },
        {
          id: '2',
          title: 'Door 2',
          visits: [
            {
              canvassAssId: '123',
              id: 'a',
              noteToOfficial: '',
              responses: [],
              timestamp: '20230503',
            },
          ],
        },
      ],
      '123'
    );

    expect(state).toEqual('started');
  });

  it('returns "done" when passed an array where all households have visits in the current assignment', () => {
    const state = getVisitState(
      [
        {
          id: '2',
          title: 'Door 2',
          visits: [
            {
              canvassAssId: '123',
              id: 'a',
              noteToOfficial: '',
              responses: [],
              timestamp: '20230503',
            },
          ],
        },
      ],
      '123'
    );

    expect(state).toEqual('done');
  });
});
