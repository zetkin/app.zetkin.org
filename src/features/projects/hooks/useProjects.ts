import { generateRandomColor } from 'utils/colorUtils';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import shouldLoad from 'core/caching/shouldLoad';
import { ZetkinProject } from 'utils/types/zetkin';
import { projectsLoad, projectsLoaded } from '../store';
import { futureToObject, IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useProjects(
  mainOrgId: number,
  fromOrgIds: number[] = []
): IFuture<ZetkinProject[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const projectsByOrgId = useAppSelector(
    (state) => state.projects.projectsByOrgId
  );
  const projectsList = useAppSelector((state) => state.projects.projectList);

  if (fromOrgIds.length == 0) {
    fromOrgIds = [mainOrgId];
  }

  const needsRecursive = fromOrgIds.length > 1;

  const future = loadListIfNecessary(projectsList, dispatch, {
    actionOnLoad: () => projectsLoad(fromOrgIds),
    actionOnSuccess: (data) => {
      const dataWithColor = data.map((project) => ({
        ...project,
        color: generateRandomColor(project.id.toString()),
      }));
      return projectsLoaded(dataWithColor);
    },
    isNecessary: () => shouldLoad(projectsByOrgId, fromOrgIds),
    loader: () =>
      apiClient.get<ZetkinProject[]>(
        `/api/orgs/${mainOrgId}/campaigns${needsRecursive ? '?recursive' : ''}`
      ),
  });

  if (future.data) {
    return {
      ...futureToObject(future),
      data: future.data.filter((c) => fromOrgIds.includes(c.organization.id)),
    };
  } else {
    return future;
  }
}
