import useEnv from './useEnv';

export default function useApiClient() {
  return useEnv().apiClient;
}
