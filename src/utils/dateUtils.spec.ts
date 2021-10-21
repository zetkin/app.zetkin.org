import { createMockEvent } from './testing';
import { ZetkinEvent } from '../types/zetkin';
import { getFirstAndLastEvent, removeOffset } from './dateUtils';

describe('getFirstAndLastEvent()', () => {
    const firstEvent = createMockEvent({
        end_time: '2022-06-16T09:00:00+00:00',
        start_time: '2022-06-16T09:00:00+00:00',
    });

    const secondEvent = createMockEvent({
        end_time: '2022-06-17T09:00:00+00:00',
        start_time: '2022-06-17T09:00:00+00:00',
    });

    const thirdEvent = createMockEvent({
        end_time: '2022-06-18T09:00:00+00:00',
        start_time: '2022-06-18T09:00:00+00:00',
    });

    it('Returns array of undefined if passed an empty array ', () => {
        const emptyArray : ZetkinEvent[] = [];
        expect(getFirstAndLastEvent(emptyArray)).toMatchObject([undefined, undefined]);
    });
    it('Returns array with two of the same event if passed an array of one event', () => {
        const singleEventArray = [firstEvent];
        expect(getFirstAndLastEvent(singleEventArray)).toMatchObject([firstEvent, firstEvent]);
    });
    it('Returns first and last event when passed an array of multiple events', () => {
        const multiEventArray = [firstEvent, secondEvent, thirdEvent];
        expect(getFirstAndLastEvent(multiEventArray)).toMatchObject([firstEvent, thirdEvent]);
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
