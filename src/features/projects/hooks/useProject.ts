import { generateRandomColor } from 'utils/colorUtils';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinProject } from 'utils/types/zetkin';
import {
  projectDeleted,
  projectLoad,
  projectLoaded,
  projectUpdate,
  projectUpdated,
} from '../store';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseProjectReturn {
  projectFuture: IFuture<ZetkinProject>;
  deleteProject: () => void;
  updateProject: (data: Partial<ZetkinProject>) => IFuture<ZetkinProject>;
}

export default function useProject(
  orgId: number,
  projectId: number
): UseProjectReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const projectsSlice = useAppSelector((state) => state.projects);
  const projectItems = projectsSlice.projectList.items;

  const projectItem = projectItems.find((item) => item.id == projectId);

  const projectFuture = loadItemIfNecessary(projectItem, dispatch, {
    actionOnLoad: () => projectLoad(projectId),
    actionOnSuccess: (data) => projectLoaded(data),
    loader: async () => {
      const project = await apiClient.get<ZetkinProject>(
        `/api/orgs/${orgId}/campaigns/${projectId}`
      );
      return {
        ...project,
        color: generateRandomColor(project.id.toString()),
      };
    },
  });

  const deleteProject = () => {
    apiClient.delete(`/api/orgs/${orgId}/campaigns/${projectId}`);
    dispatch(projectDeleted([orgId, projectId]));
  };

  const updateProject = (
    data: Partial<ZetkinProject>
  ): IFuture<ZetkinProject> => {
    const mutatingAttributes = Object.keys(data);

    dispatch(projectUpdate([projectId, mutatingAttributes]));
    const promise = apiClient
      .patch<ZetkinProject>(`/api/orgs/${orgId}/campaigns/${projectId}`, data)
      .then((data: ZetkinProject) => {
        dispatch(projectUpdated(data));
        return data;
      });

    return new PromiseFuture(promise);
  };

  return {
    deleteProject,
    projectFuture,
    updateProject,
  };
}
