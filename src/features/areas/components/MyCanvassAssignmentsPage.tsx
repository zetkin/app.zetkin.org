'use client';

import { FC } from 'react';

import useMyCanvassSessions from 'features/areas/hooks/useMyCanvassSessions';
import { ZetkinCanvassSession } from '../types';

const MyCanvassAssignmentsPage: FC = () => {
  const mySessions = useMyCanvassSessions().data || [];

  const sessionByPersonId: Record<string, ZetkinCanvassSession[]> = {};
  mySessions.forEach((session) => {
    if (!sessionByPersonId[session.assignee.id]) {
      sessionByPersonId[session.assignee.id] = [session];
    } else {
      sessionByPersonId[session.assignee.id].push(session);
    }
  });

  return (
    <div>
      MY SESSIONS
      {mySessions.map((session) => (
        <p
          key={`${session.assignment.id} ${session.assignee.id}`}
        >{`${session.assignment.title} ${session.area.title}`}</p>
      ))}
    </div>
  );
};

export default MyCanvassAssignmentsPage;
