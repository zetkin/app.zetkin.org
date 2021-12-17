import dayjs from 'dayjs';
import { ZetkinView } from '../types/views';

/**
 * A very basic method to pick the 3 most salient views for a given user
 * @param allViews
 * @param owner
 */
export const getSuggestedViews = (allViews: ZetkinView[], owner: {id: number; name: string} | null): ZetkinView[] => {
    const sorted = allViews.sort(
        (a,b) => dayjs(a.created).isBefore(b.created) ? 1 : -1,
    );
    const filtered = !owner ? sorted : sorted.filter(view => view.owner.id === owner.id);
    return filtered.length >= 3 ? filtered.slice(0,3) : sorted.slice(0,3);
};
