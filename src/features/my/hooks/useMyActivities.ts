import { useMyAreaAssignmentsFuture } from 'features/canvass/hooks/useMyAreaAssignments';
import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
import { useMyEventsFuture } from 'features/my/hooks/useMyEvents';
import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';
import { MyActivity } from 'features/public/types';

export default function useMyActivities(): IFuture<MyActivity[]> {
  const areaAssignmentsFuture = useMyAreaAssignmentsFuture();
  const callAssignmentsFuture = useMyCallAssignments();
  const eventsFuture = useMyEventsFuture();

  if (
    !areaAssignmentsFuture.data ||
    !callAssignmentsFuture.data ||
    !eventsFuture.data
  ) {
    return new LoadingFuture();
  }

  const activities: MyActivity[] = [
    ...areaAssignmentsFuture.data.map<MyActivity>((data) => ({
      data,
      kind: 'canvass',
      start: new Date(data.start_date || 0),
    })),
    ...callAssignmentsFuture.data.map<MyActivity>((data) => ({
      data,
      kind: 'call',
      start: new Date(data.start_date || 0),
    })),
    ...eventsFuture.data.map<MyActivity>((data) => ({
      data,
      kind: 'event',
      start: new Date(data.start_time || 0),
    })),
  ];

  return new ResolvedFuture(
    activities.sort((a, b) => a.start.getTime() - b.start.getTime())
  );
}
