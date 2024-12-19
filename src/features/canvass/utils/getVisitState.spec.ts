import getVisitState from './getVisitState';

describe('getVisitState()', () => {
  it('returns "none" when passed an empty array', () => {
    const state = getVisitState([], '123');

    expect(state).toEqual('none');
  });

  it('returns "none" when passed an array where no housholds have visits in current assignment', () => {
    const state = getVisitState(
      [
        { id: '1', title: 'Door 1', visits: [] },
        {
          id: '2',
          title: 'Door 2',
          visits: [
            {
              areaAssId: '345',
              id: 'a',
              noteToOfficial: '',
              personId: 1,
              responses: [],
              timestamp: '20230503',
            },
          ],
        },
      ],
      '123'
    );

    expect(state).toEqual('none');
  });

  it('returns "some" when passed an array where only one household has visits in the current assignment', () => {
    const state = getVisitState(
      [
        { id: '1', title: 'Door 1', visits: [] },
        {
          id: '2',
          title: 'Door 2',
          visits: [
            {
              areaAssId: '123',
              id: 'a',
              noteToOfficial: '',
              personId: 1,
              responses: [],
              timestamp: '20230503',
            },
          ],
        },
      ],
      '123'
    );

    expect(state).toEqual('some');
  });

  it('returns "all" when passed an array where all households have visits in the current assignment', () => {
    const state = getVisitState(
      [
        {
          id: '2',
          title: 'Door 2',
          visits: [
            {
              areaAssId: '123',
              id: 'a',
              noteToOfficial: '',
              personId: 1,
              responses: [],
              timestamp: '20230503',
            },
          ],
        },
      ],
      '123'
    );

    expect(state).toEqual('all');
  });
});
