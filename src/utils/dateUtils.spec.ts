import { ZetkinEvent } from '../types/zetkin';
import { getFirstAndLastEvent, removeOffset } from './dateUtils';

const firstEvent = {
    activity: {
        title: 'Active activity',
    },
    campaign: {
        id: 1,
        title: 'Testcampaign Title',
    },
    contact: null,
    end_time: '2022-06-16T09:00:00+00:00',
    id: 5,
    info_text: 'Info text is informational',
    location: {
        id: 1,
        lat: 51.192702,
        lng: 12.284873,
        title: 'Dorfplatz',
    },
    num_participants_available: 3,
    num_participants_required: 2,
    organization: {
        id: 1,
        title: 'My Organization',
    },
    start_time: '2022-06-16T07:00:00+00:00',
    title: undefined,
    url: undefined,
};

const secondEvent = {
    ...firstEvent,
    end_time: '2022-06-17T09:00:00+00:00',
    start_time: '2022-06-17T07:00:00+00:00',
};

const thirdEvent = {
    ...firstEvent,
    end_time: '2022-06-18T09:00:00+00:00',
    start_time: '2022-06-18T07:00:00+00:00',
};

const fourthEvent = {
    ...firstEvent,
    end_time: '2022-06-19T09:00:00+00:00',
    start_time: '2022-06-19T07:00:00+00:00',
};

describe('getFirstAndLastEvent()', () => {
    it('Returns array of undefined if passed an empty array ', () => {
        const emptyArray : ZetkinEvent[] = [];
        expect(getFirstAndLastEvent(emptyArray)).toMatchObject([undefined, undefined]);
    });
    it('Returns array with two of the same event if passed an array of one event', () => {
        const singleEventArray = [firstEvent];
        expect(getFirstAndLastEvent(singleEventArray)).toMatchObject([firstEvent, firstEvent]);
    });
    it('Returns first and last event when passed an array of multiple events', () => {
        const multiEventArray = [thirdEvent, firstEvent, fourthEvent, secondEvent];
        expect(getFirstAndLastEvent(multiEventArray)).toMatchObject([firstEvent, fourthEvent]);
    });
});

describe('removeOffset()', () => {
    it('Returns an unchanged datestring when sent one without offset', () => {
        expect(removeOffset('22-06-13T07:00:00')).toMatch('22-06-13T07:00:00');
    });
    it('Returns a datestring with no offset when sent one with offset', () => {
        expect(removeOffset('22-06-13T07:00:00+00:00')).toMatch('22-06-13T07:00:00');
    });
});
