import { InfoOutlined } from '@mui/icons-material';
import NextLink from 'next/link';
import { Box, Link, Typography } from '@mui/material';

interface NoActivitiesProps {
  href?: string;
  linkMessage?: string;
  message: string;
}

const NoActivities = ({ href, linkMessage, message }: NoActivitiesProps) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      paddingTop={5}
    >
      <InfoOutlined color="secondary" sx={{ fontSize: '12em' }} />
      <Typography color="secondary">{message}</Typography>
      {href && (
        <NextLink href={href} passHref>
          <Link underline="none">
            <Typography color="secondary">{linkMessage}</Typography>
          </Link>
        </NextLink>
      )}
    </Box>
  );
};

export default NoActivities;
