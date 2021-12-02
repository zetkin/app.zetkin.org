import getViews from '../../../../../../fetching/views/getViews';
import Mockdata from '../../../../../../../playwright/mockData/orgs/KPD/people/views/Suggested';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import ViewCard from '../ViewCard';
import ZetkinQuery from '../../../../../../components/ZetkinQuery';
import ZetkinSection from '../../../../../../components/ZetkinSection';
import { ZetkinView } from '../../../../../../types/zetkin';
import { Grid, makeStyles, Theme } from '@material-ui/core';

const VIEWS = Mockdata;

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

const Suggested: React.FunctionComponent = () => {
    const classes = useStyles();
    const router = useRouter();
    const { orgId } = router.query;
    const viewsQuery = useQuery(['views', orgId], getViews(orgId as string));

    return (
        <ZetkinQuery queries={{ viewsQuery }}>
            { ({ queries: { viewsQuery } }) => {
                if (viewsQuery.data.length === 0) {
                    return null;
                }

                return (
                    <ZetkinSection title="Suggested">
                        <Grid className={ classes.container } container spacing={ 3 }>
                            { VIEWS.map((view: ZetkinView) => (
                                <Grid key={ view.id } className={ classes.item } item>
                                    <ViewCard view={ view } />
                                </Grid>
                            )) }
                        </Grid>
                    </ZetkinSection>
                );
            } }
        </ZetkinQuery>);
};

export default Suggested;
