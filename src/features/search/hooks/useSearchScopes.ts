import { SCOPE_TYPE, SearchScope } from '../scopes/types';
import { useAppSelector, useNumericRouteParams } from 'core/hooks';

/**
 * The scopes the current page sits in, outermost first.
 *
 * A survey inside a project gives [project, survey], so nesting in the URL
 * becomes nesting in search. Titles are read from what is already in the
 * store, so opening search never triggers a request of its own. A scope whose
 * title isn't loaded yet is left out rather than shown as a blank pill.
 *
 * A scope always names one instance. A section such as the calendar or the
 * activities list is not a scope, because it stands for a set of types.
 */
export default function useSearchScopes(): SearchScope[] {
  const {
    callAssId,
    eventId,
    folderId,
    instanceId,
    journeyId,
    personId,
    projectId,
    surveyId,
    taskId,
  } = useNumericRouteParams();

  const projects = useAppSelector((state) => state.projects.projectList.items);
  const folders = useAppSelector((state) => state.views.folderList.items);
  const journeys = useAppSelector((state) => state.journeys.journeyList.items);
  const instances = useAppSelector(
    (state) => state.journeys.journeyInstanceList.items
  );
  const person = useAppSelector((state) => state.profiles.personById[personId]);
  const events = useAppSelector((state) => state.events.eventList.items);
  const surveys = useAppSelector((state) => state.surveys.surveyList.items);
  const tasks = useAppSelector((state) => state.tasks.tasksList.items);
  const callAssignments = useAppSelector(
    (state) => state.callAssignments.assignmentList.items
  );

  const scopes: SearchScope[] = [];

  const add = (
    type: SCOPE_TYPE,
    id: number | undefined,
    title: string | undefined | null
  ) => {
    if (id && title) {
      scopes.push({ id, title, type });
    }
  };

  const titleOf = <DataType extends { id: number; title?: string | null }>(
    items: { data: DataType | null; id: number | string }[] | undefined,
    id: number
  ) => items?.find((item) => item.id == id)?.data?.title;

  // Outermost first, so that the pills read like the breadcrumb
  add(SCOPE_TYPE.PROJECT, projectId, titleOf(projects, projectId));
  add(SCOPE_TYPE.FOLDER, folderId, titleOf(folders, folderId));
  add(SCOPE_TYPE.JOURNEY, journeyId, titleOf(journeys, journeyId));
  add(
    SCOPE_TYPE.JOURNEY_INSTANCE,
    instanceId,
    instances?.find((item) => item.id == instanceId)?.data?.title
  );
  add(
    SCOPE_TYPE.PERSON,
    personId,
    person?.data ? `${person.data.first_name} ${person.data.last_name}` : null
  );
  add(
    SCOPE_TYPE.EVENT,
    eventId,
    events?.find((item) => item.id == eventId)?.data?.title ||
      events?.find((item) => item.id == eventId)?.data?.activity?.title
  );
  add(SCOPE_TYPE.SURVEY, surveyId, titleOf(surveys, surveyId));
  add(SCOPE_TYPE.TASK, taskId, titleOf(tasks, taskId));
  add(
    SCOPE_TYPE.CALL_ASSIGNMENT,
    callAssId,
    titleOf(callAssignments, callAssId)
  );

  return scopes;
}
