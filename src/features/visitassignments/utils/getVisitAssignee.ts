import {
  VisitAssigneeInfo,
  ZetkinVisitAssignee,
} from 'features/visitassignments/types';

const getVisitAssignees = (sessions: ZetkinVisitAssignee[]) => {
  const sessionsByPersonId: Record<number, VisitAssigneeInfo> = {};

  sessions.forEach((session) => {
    if (session.id) {
      if (!sessionsByPersonId[session.id]) {
        sessionsByPersonId[session.id] = {
          id: session.id,
          sessions: [session],
        };
      } else {
        sessionsByPersonId[session.id].sessions.push(session);
      }
    }
  });

  const visitAssignees = Object.values(sessionsByPersonId);
  return visitAssignees;
};

export default getVisitAssignees;
