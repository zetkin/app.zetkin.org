import { mockObject } from './index';
import mockPerson from './mockPerson';
import { ZetkinEventParticipant } from '../../types/zetkin';

const eventParticipant: ZetkinEventParticipant = {
  ...mockPerson(),
  attended: null,
  cancelled: null,
  noshow: null,
  reminder_sent: '2022-05-16T07:00:00+00:00',
};
const mockEventParticipant = (
  overrides?: Partial<ZetkinEventParticipant>
): ZetkinEventParticipant => {
  return mockObject(eventParticipant, overrides);
};

export default mockEventParticipant;

export { eventParticipant };
