import { projectCreate, projectCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinProject, ZetkinProjectPostBody } from 'utils/types/zetkin';

export default function useCreateProject(
  orgId: number
): (projectBody: ZetkinProjectPostBody) => Promise<ZetkinProject> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return (projectBody: ZetkinProjectPostBody): Promise<ZetkinProject> => {
    dispatch(projectCreate());

    const promise = apiClient
      .post<
        ZetkinProject,
        ZetkinProjectPostBody
      >(`/api/orgs/${orgId}/campaigns`, projectBody)
      .then((project: ZetkinProject) => {
        dispatch(projectCreated(project));
        return project;
      });

    return promise;
  };
}
