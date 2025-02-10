import { AreaAssigneeInfo, ZetkinAreaAssignmentSession } from '../types';

const getAreaAssignees = (sessions: ZetkinAreaAssignmentSession[]) => {
  const sessionsByPersonId: Record<number, AreaAssigneeInfo> = {};

  sessions.forEach((session) => {
    if (session.assignee && session.assignee.id) {
      if (!sessionsByPersonId[session.assignee.id]) {
        sessionsByPersonId[session.assignee.id] = {
          id: session.assignee.id,
          person: session.assignee,
          sessions: [session],
        };
      } else {
        sessionsByPersonId[session.assignee.id].sessions.push(session);
      }
    }
  });

  const areaAssignees = Object.values(sessionsByPersonId);
  return areaAssignees;
};

export default getAreaAssignees;
