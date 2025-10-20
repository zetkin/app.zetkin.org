import { useSearchParams } from 'next/navigation';
import { useStore } from 'react-redux';
import { useEffect } from 'react';

import { useAppDispatch } from 'core/hooks';
import { initiateAssignment, initiateWithoutAssignment } from '../store';
import useLocalStorage from 'zui/hooks/useLocalStorage';
import { LaneState } from '../types';
import useUser from 'core/hooks/useUser';
import { RootState } from 'core/store';
import useMyAssignments from './useMyAssignments';

export default function useCallInitialization() {
  const dispatch = useAppDispatch();
  const queryParams = useSearchParams();
  const store = useStore();
  const user = useUser();
  const userCallAssignments = useMyAssignments();

  const [callLanes, setLanes] = useLocalStorage<{
    activeLaneIndex: number;
    lanes: LaneState[];
    timestamp: number;
    userId: number;
  } | null>('callLanes', null);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState() as RootState;
      if (user?.id) {
        setLanes({
          activeLaneIndex: state.call.activeLaneIndex,
          lanes: state.call.lanes,
          timestamp: new Date().getTime(),
          userId: user.id,
        });
      }
    });
    return () => unsubscribe();
  }, [store]);

  const assignmentIdFromQuery = queryParams?.get('assignment');

  const lanesAssignedToUser =
    callLanes?.lanes.filter((lane) =>
      userCallAssignments.some(
        (assignment) => assignment.id == lane.assignmentId
      )
    ) || [];

  const activeLanes = lanesAssignedToUser.filter((lane) => {
    const assignment = userCallAssignments.find(
      (assignment) => assignment.id == lane.assignmentId
    );

    if (assignment) {
      const startDate = assignment.start_date;
      const endDate = assignment.end_date;
      const now = new Date();

      const hasStarted = startDate && new Date(startDate) < now;
      const isOngoing = !endDate || (endDate && new Date(endDate) > now);
      return assignment && hasStarted && isOngoing;
    }

    return false;
  });

  let canInitialize = false;
  if (assignmentIdFromQuery) {
    canInitialize = true;
  } else if (callLanes) {
    const thisUserHasSavedLanes =
      !!activeLanes &&
      activeLanes.length > 0 &&
      !!user &&
      callLanes.userId == user.id;
    const savedLanesAreFresh =
      callLanes.timestamp > new Date().getTime() - 3600;

    canInitialize = thisUserHasSavedLanes && savedLanesAreFresh;
  }

  const initialize = () => {
    if (assignmentIdFromQuery) {
      dispatch(
        initiateAssignment([parseInt(assignmentIdFromQuery), activeLanes])
      );
      history.replaceState(null, '', '/call');
    } else if (callLanes) {
      dispatch(
        initiateWithoutAssignment([callLanes.activeLaneIndex, activeLanes])
      );
    }
  };

  return {
    canInitialize,
    initialize,
  };
}
