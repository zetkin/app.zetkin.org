import nProgress from 'nprogress';
import { QueryClient, UseMutationOptions } from 'react-query';

export const makeUseMutationOptions = <Input, Result>(
    queryClient: QueryClient,
    key: string[],
    mutationOptions?: UseMutationOptions<Result, unknown, Input, unknown>,
): UseMutationOptions<Result, unknown, Input, unknown> => {
    return {
        onMutate: () => nProgress.start(),
        onSettled: async () => nProgress.done(),
        onSuccess: async () => queryClient.invalidateQueries(key),
        ...mutationOptions,
    };
};
