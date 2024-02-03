import { Box, ListItemText, Typography } from '@mui/material';

const ResultsListItemText: React.FunctionComponent<{
  primary: string | React.ReactNode;
  secondary?: string | React.ReactNode;
}> = ({ primary, secondary }) => {
  return (
    <ListItemText>
      <Box display={'flex'} flexDirection={'column'}>
        {secondary && <Typography variant="body2">{secondary}</Typography>}
        <Typography>{primary}</Typography>
      </Box>
    </ListItemText>
  );
};

export default ResultsListItemText;
