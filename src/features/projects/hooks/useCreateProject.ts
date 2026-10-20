import { projectCreate, projectCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinProject, ZetkinProjectPostBody } from 'utils/types/zetkin';

export default function useCreateProject(
  orgId: number
): (projectBody: ZetkinProjectPostBody) => Promise<void> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (projectBody: ZetkinProjectPostBody): Promise<void> => {
    dispatch(projectCreate());

    const project = await apiClient.post<ZetkinProject, ZetkinProjectPostBody>(
      `/api/orgs/${orgId}/campaigns`,
      projectBody
    );

    dispatch(projectCreated(project));
  };
}
