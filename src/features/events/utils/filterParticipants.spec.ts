import {
  filterParticipantsList,
  filterSignups,
  filterSignupOrParticipantRows,
  filterUnverifiedSignups,
} from './filterParticipants';
import type { ZetkinEventParticipant } from 'utils/types/zetkin';
import mockEventParticipant from 'utils/testing/mocks/mockEventParticipant';
import mockPerson from 'utils/testing/mocks/mockPerson';
import { EventSignupModelType } from '../models';

describe('filterUnverifiedSignups()', () => {
  it('filters unverified signups by name', () => {
    const rows: EventSignupModelType[] = [
      {
        created: '2024-01-01T00:00:00.000Z',
        email: 'clara@kpd.org',
        eventId: 1,
        first_name: 'Clara',
        gdpr_consent: true,
        id: 'signup-1',
        last_name: 'Zetkin',
        orgId: 1,
        phone: '123',
      },
      {
        created: '2024-01-01T00:00:00.000Z',
        email: 'organizer@example.com',
        eventId: 1,
        first_name: 'Organizer',
        gdpr_consent: true,
        id: 'signup-2',
        last_name: 'Activist',
        orgId: 1,
        phone: '456',
      },
    ];

    const result = filterUnverifiedSignups(rows, 'Clara');

    expect(result.map((row) => row.id)).toEqual(['signup-1']);
  });
});

describe('filterSignups()', () => {
  it('filters responses by person fields', () => {
    const maria = mockPerson({
      email: 'clara@kpd.org',
      first_name: 'Clara',
      id: 101,
      last_name: 'Zetkin',
      phone: '555-1000',
    });
    const sam = mockPerson({
      email: 'organizer@example.com',
      first_name: 'Organizer',
      id: 102,
      last_name: 'Activist',
      phone: '555-2000',
    });

    const rows: Parameters<typeof filterSignups>[0] = [
      {
        action_id: 10,
        id: 1,
        person: {
          email: maria.email,
          first_name: maria.first_name,
          id: maria.id,
          last_name: maria.last_name,
          name: 'Clara Zetkin',
          phone: maria.phone,
        },
        response_date: '2024-02-01',
      },
      {
        action_id: 11,
        id: 2,
        person: {
          email: sam.email,
          first_name: sam.first_name,
          id: sam.id,
          last_name: sam.last_name,
          name: 'Organizer Activist',
          phone: sam.phone,
        },
        response_date: '2024-02-02',
      },
    ];

    const result = filterSignups(rows, 'Clara');

    expect(result.map((row) => row.id)).toEqual([1]);
  });
});

describe('filterParticipantsList()', () => {
  it('filters participants by name', () => {
    const rows: ZetkinEventParticipant[] = [
      mockEventParticipant({
        first_name: 'Clara',
        id: 201,
        last_name: 'Zetkin',
        reminder_sent: null,
      }),
      mockEventParticipant({
        first_name: 'Organizer',
        id: 202,
        last_name: 'Activist',
        reminder_sent: null,
      }),
    ];

    const result = filterParticipantsList(rows, 'Organizer');

    expect(result.map((row) => row.id)).toEqual([202]);
  });
});

describe('filterSignupOrParticipantRows()', () => {
  it('filters signup rows when list contains responses', () => {
    const maria = mockPerson({
      email: 'clara@kpd.org',
      first_name: 'Clara',
      id: 101,
      last_name: 'Zetkin',
      phone: '555-1000',
    });
    const sam = mockPerson({
      email: 'organizer@example.com',
      first_name: 'Organizer',
      id: 102,
      last_name: 'Activist',
      phone: '555-2000',
    });

    const rows: Parameters<typeof filterSignups>[0] = [
      {
        action_id: 10,
        id: 1,
        person: {
          email: maria.email,
          first_name: maria.first_name,
          id: maria.id,
          last_name: maria.last_name,
          name: 'Clara Zetkin',
          phone: maria.phone,
        },
        response_date: '2024-02-01',
      },
      {
        action_id: 11,
        id: 2,
        person: {
          email: sam.email,
          first_name: sam.first_name,
          id: sam.id,
          last_name: sam.last_name,
          name: 'Organizer Activist',
          phone: sam.phone,
        },
        response_date: '2024-02-02',
      },
    ];

    const result = filterSignupOrParticipantRows(rows, 'Clara');

    expect(result.map((row) => row.id)).toEqual([1]);
  });

  it('filters participant rows when list contains participants', () => {
    const rows: ZetkinEventParticipant[] = [
      mockEventParticipant({
        first_name: 'Clara',
        id: 201,
        last_name: 'Zetkin',
        reminder_sent: null,
      }),
      mockEventParticipant({
        first_name: 'Organizer',
        id: 202,
        last_name: 'Activist',
        reminder_sent: null,
      }),
    ];

    const result = filterSignupOrParticipantRows(rows, 'Organizer');

    expect(result.map((row) => row.id)).toEqual([202]);
  });
});
