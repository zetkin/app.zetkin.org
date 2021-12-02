import ViewCard from '../ViewCard';
import ZetkinSection from '../../../../../../components/ZetkinSection';
import { ZetkinView } from '../../../../../../types/zetkin';
import {  Grid, makeStyles, Theme } from '@material-ui/core';

const VIEWS: ZetkinView[] = [{
    created: 'Yesterday',
    description: 'A view filtered by A',
    id: 213123,
    organization: { id: 1234123453123, title: 'Org 1' },
    owner: { id: 346346346, name: 'nobody' },
    title: 'View ABC',
},
{
    created: 'Today',
    description: 'A view filtered by B',
    id: 245234523,
    organization: { id: 1234167423123, title: 'Org 1' },
    owner: { id: 346346346, name: 'nobody' },
    title: 'View XYZ',
},
{
    created: 'Today',
    description: 'A view filtered by B',
    id: 243623,
    organization: { id: 123412365123, title: 'Org 1' },
    owner: { id: 346346346, name: 'nobody' },
    title: 'View XYZ',
}];

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
};

export default Suggested;
