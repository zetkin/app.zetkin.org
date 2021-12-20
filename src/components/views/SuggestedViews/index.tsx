import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Grid, makeStyles, Theme } from '@material-ui/core';

import getUserMemberships from 'fetching/getUserMemberships';
import getViews from 'fetching/views/getViews';
import ViewCard from './ViewCard';
import ZetkinQuery from 'components/ZetkinQuery';
import ZetkinSection from 'components/ZetkinSection';
import { ZetkinView } from 'types/zetkin';

export const getSuggestedViews = (allViews: ZetkinView[], ownerId?: number): ZetkinView[] => {
    const sorted = allViews.sort(
        (a,b) => dayjs(a.created).isBefore(b.created) ? 1 : -1,
    );
    const filtered = !ownerId ? sorted : sorted.filter(view => view.owner.id === ownerId);
    return filtered.length >= 3 ? filtered.slice(0,3) : sorted.slice(0,3);
};

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
        },
        marginBottom: theme.spacing(1),
    },
    item: {
        flex: 1,
    },
}));

const SuggestedViews: React.FunctionComponent = () => {
    const classes = useStyles();
    const intl = useIntl();
    const router = useRouter();
    const { orgId } = router.query;

    const membershipsQuery = useQuery('userMemberships', getUserMemberships());
    const activeMembership = membershipsQuery?.data?.find(m => m.organization.id.toString() == orgId);
    const member = activeMembership?.profile;

    const viewsQuery = useQuery(['views', orgId], getViews(orgId as string));
    const onClickCard = (evt: React.ChangeEvent<HTMLButtonElement>) => {
        router.push(`/organize/${orgId}/people/views/${evt.currentTarget.value}`);
    };

    return (
        <ZetkinQuery queries={{ viewsQuery }}>
            { ({ queries: { viewsQuery } }) => {
                const suggestedViews = getSuggestedViews(viewsQuery.data, member?.id);

                // if fewer than 3 views supplied, render nothing
                if (viewsQuery.data.length < 3) return null;

                return (
                    <ZetkinSection title={ intl.formatMessage(
                        { id: 'misc.views.suggested.sectionTitle' }) }>
                        <Grid className={ classes.container } container spacing={ 3 }>
                            { suggestedViews.map((view: ZetkinView) => (
                                <Grid key={ view.id } className={ classes.item } item>
                                    <ViewCard onClick={ onClickCard } view={ view } />
                                </Grid>
                            )) }
                        </Grid>
                    </ZetkinSection>
                );
            } }
        </ZetkinQuery>);
};

export default SuggestedViews;
