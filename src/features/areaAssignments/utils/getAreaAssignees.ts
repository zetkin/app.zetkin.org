import { AreaAssigneeInfo, ZetkinAreaAssignee } from '../types';

const getAreaAssignees = (sessions: ZetkinAreaAssignee[]) => {
  const sessionsByPersonId: Record<number, AreaAssigneeInfo> = {};

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

  const areaAssignees = Object.values(sessionsByPersonId);
  return areaAssignees;
};

export default getAreaAssignees;
