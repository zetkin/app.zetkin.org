import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { Home, Mail, Phone } from '@material-ui/icons';

import ZetkinCard from 'components/ZetkinCard';
import { ZetkinPerson } from 'types/zetkin';

const useStyles = makeStyles((theme) => ({
  detailIcon: {
    color: '#4b5c6b',
    width: 40,
  },
  detailValue: {
    color: '#4b5c6b',
  },
  title: {
    marginBottom: theme.spacing(1),
  },
}));

const PersonDetailsCard: React.FunctionComponent<ZetkinPerson> = (person) => {
  const classes = useStyles();
  const details = [
    { icon: <Phone />, value: person.phone },
    { icon: <Mail />, value: person.email },
    {
      icon: <Home />,
      value: [person.street_address, person.city]
        .filter((item) => !!item)
        .join(', '),
    },
  ];

  return (
    <Box display="flex" flexDirection="column">
      <Typography className={classes.title} color="secondary" variant="h6">
        Contact details
      </Typography>
      <ZetkinCard>
        <Grid container direction="column" spacing={2}>
          {details
            .filter((detail) => !!detail.value)
            .map((detail, idx) => (
              <Grid key={idx} container direction="row" item>
                <Box className={classes.detailIcon}>{detail.icon}</Box>
                <Box>
                  <Typography className={classes.detailValue} variant="body1">
                    {detail.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
        </Grid>
      </ZetkinCard>
    </Box>
  );
};

export default PersonDetailsCard;
