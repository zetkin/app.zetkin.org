import dayjs from 'dayjs';

import { getSuggestedViews } from '.';
import mockView from 'utils/testing/mocks/mockView';

describe('getSuggestedViews()', () => {
    const now = dayjs();
    const views = [mockView({
        created: now.format('YYYY-MM-DDTHH:mm:ss'),
        owner: { id : 46745235, name: 'someone else' },
        title: 'another view',
    })].concat([1,2,3,4,5].map(days => mockView({
        created: now.subtract(days, 'day').format('YYYY-MM-DDTHH:mm:ss'),
        id: days + 436353,
        title: `View number ${days}`,
    })));

    it('Picks the 3 most recent views belonging to the user', () => {
        expect(getSuggestedViews(views, mockView().owner.id).map(view => view.title))
            .toMatchObject(['View number 1', 'View number 2', 'View number 3']);
    });

    it('Picks the 3 most recent views if the user has none', () => {
        expect(getSuggestedViews(views, 88888).map(view => view.title))
            .toMatchObject(['another view', 'View number 1', 'View number 2']);
    });
});

