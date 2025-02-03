import useMyAreaAssignments from 'features/canvass/hooks/useMyAreaAssignments';
import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
import useMyEvents from 'features/events/hooks/useMyEvents';
import { MyActivity } from '../types';

export default function useMyActivities() {
  const areaAssignments = useMyAreaAssignments();
  const callAssignments = useMyCallAssignments();
  const events = useMyEvents();

  const activities: MyActivity[] = [
    ...areaAssignments.map<MyActivity>((data) => ({
      data,
      kind: 'canvass',
      start: new Date(data.start_date || 0),
    })),
    ...callAssignments.map<MyActivity>((data) => ({
      data,
      kind: 'call',
      start: new Date(data.start_date || 0),
    })),
    ...events.map<MyActivity>((data) => ({
      data,
      kind: 'event',
      start: new Date(data.start_time || 0),
    })),
  ];

  return activities.sort((a, b) => a.start.getTime() - b.start.getTime());
}
