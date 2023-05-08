import { mockObject } from './index';
import { ZetkinEventResponse } from '../../types/zetkin';

const eventResponse: ZetkinEventResponse = {
  action_id: 1,
  id: 1,
  person: {
    id: 1,
    name: 'Clara Zetkin',
  },
  response_date: '2022-04-16T07:00:00+00:00',
};
const mockEventResponse = (
  overrides?: Partial<ZetkinEventResponse>
): ZetkinEventResponse => {
  return mockObject(eventResponse, overrides);
};

export default mockEventResponse;

export { eventResponse };
