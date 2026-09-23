import { useAppSelector, useNumericRouteParams } from 'core/hooks';

export type SearchScope = {
  id: number;
  title: string;
  type: 'project';
};

/**
 * The thing the current page is "about", which search can be limited to.
 *
 * Only projects for now. Other scopes (a person, a view, an event) can be
 * added here as the API learns to filter by them.
 */
export default function useSearchScope(): SearchScope | null {
  const { projectId } = useNumericRouteParams();
  const project = useAppSelector((state) =>
    state.projects.projectList.items.find((item) => item.id == projectId)
  );

  // Deliberately reads what is already in the store instead of loading the
  // project, so that opening search never triggers a request of its own.
  if (!projectId || !project?.data) {
    return null;
  }

  return {
    id: project.data.id,
    title: project.data.title,
    type: 'project',
  };
}
