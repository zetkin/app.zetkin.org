import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { bookingsLoad, bookingsLoaded } from 'features/events/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEventBookings(): IFuture<ZetkinEvent[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const bookingsList = useAppSelector((state) => state.events.bookingsList);

  return loadListIfNecessary(bookingsList, dispatch, {
    actionOnLoad: () => dispatch(bookingsLoad()),
    actionOnSuccess: (data) => dispatch(bookingsLoaded(data)),
    loader: () =>
      apiClient.get<ZetkinEvent[]>(
        `/api/users/me/actions?filter=${encodeURIComponent(
          'status!=cancelled'
        )}`
      ),
  });
}
