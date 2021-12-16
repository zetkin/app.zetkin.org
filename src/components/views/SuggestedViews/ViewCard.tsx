import { ZetkinView } from 'types/zetkin';
import {
    Card,
    CardActionArea,
    Fade,
    Grid,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) => ({
    action: {
        padding: theme.spacing(2),
    },
    content: {
        minHeight: 200,
    },
}));

const ViewCard: React.FunctionComponent<{view: ZetkinView}> = ({ view }) => {
    const classes = useStyles();

    if (!view) return <div />;
    return (
        <Fade in>
            <Card>
                { /* eslint-disable-next-line no-console */ }
                <CardActionArea className={ classes.action } onClick={ () => console.log('go to view') }>
                    <Grid className={ classes.content } container direction="column" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">{ view.title }</Typography>
                            <Typography variant="body2">{ view.description }</Typography>
                        </Grid>
                        <Grid item>
                            <Typography component="p" variant="caption">Last edited by</Typography>
                            <Typography component="p" variant="caption">{ view.created }</Typography>
                        </Grid>
                    </Grid>
                </CardActionArea>
            </Card>
        </Fade>
    );
};

export default ViewCard;
