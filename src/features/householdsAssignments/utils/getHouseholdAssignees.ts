import { HouseholdAssigneeInfo, ZetkinHouseholdAssignee } from '../types';

const getHouseholdAssignees = (sessions: ZetkinHouseholdAssignee[]) => {
  const sessionsByPersonId: Record<number, HouseholdAssigneeInfo> = {};

  sessions.forEach((session) => {
    if (session.user_id) {
      if (!sessionsByPersonId[session.user_id]) {
        sessionsByPersonId[session.user_id] = {
          id: session.user_id,
          sessions: [session],
        };
      } else {
        sessionsByPersonId[session.user_id].sessions.push(session);
      }
    }
  });

  return Object.values(sessionsByPersonId);
};

export default getHouseholdAssignees;
