import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Grid, makeStyles, Theme } from '@material-ui/core';

import { getSuggestedViews } from 'utils/datasetUtils';
import getViews from 'fetching/views/getViews';
import { useUser } from 'hooks';
import ViewCard from './ViewCard';
import ZetkinQuery from 'components/ZetkinQuery';
import ZetkinSection from 'components/ZetkinSection';
import { ZetkinView } from 'types/zetkin';

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
    const router = useRouter();
    const user = useUser();
    const { orgId } = router.query;
    const viewsQuery = useQuery(['views', orgId], getViews(orgId as string));
    const onClickCard = (evt: React.ChangeEvent<HTMLButtonElement>) => {
        router.push(`/organize/${orgId}/people/views/${evt.currentTarget.value}`);
    };

    // if fewer than 3 views supplied, render nothing
    if (!viewsQuery.data || viewsQuery.data.length < 3) return <div />;
    const owner = user && { id: user.id, name: `${user.first_name} ${user.last_name}` };
    const views = getSuggestedViews(viewsQuery?.data, owner);

    return (
        <ZetkinQuery queries={{ viewsQuery }}>
            { ({ queries: { viewsQuery } }) => {
                if (viewsQuery.data.length < 3) {
                    return null;
                }

                return (
                    <ZetkinSection title="Suggested">
                        <Grid className={ classes.container } container spacing={ 3 }>
                            { views?.map((view: ZetkinView) => (
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
