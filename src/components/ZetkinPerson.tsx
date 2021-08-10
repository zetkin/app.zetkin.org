import { Avatar, Box, Typography } from '@material-ui/core';

const ZetkinPerson: React.FunctionComponent<{
  person: {first_name: string; id: number; last_name: string };
  subtitle?: string;
}> = ({ person, subtitle  }) => {
    return (
        <Box display="flex">
            <Avatar />
            <Box alignItems="start" display="flex" flexDirection="column" justifyContent="center" ml={ 1 }>
                <Typography variant="body1">{ person.first_name } { person.last_name }</Typography>
                { subtitle && (
                    <Typography variant="body2">{ subtitle }</Typography>
                ) }
            </Box>
        </Box>
    );
};

export default ZetkinPerson;
