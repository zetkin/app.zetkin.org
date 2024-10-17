import { CanvasserInfo, ZetkinCanvassSession } from '../types';

const getCanvassers = (sessions: ZetkinCanvassSession[]) => {
  const sessionsByPersonId: Record<number, CanvasserInfo> = {};

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

  const canvassers = Object.values(sessionsByPersonId);
  return canvassers;
};

export default getCanvassers;
