import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  BoxProps,
  Link,
  Tooltip,
  Typography,
} from '@mui/material';

/**
 * If `link` is `true`, wraps the children in a NextLink.
 * Otherwise, it just returns the children directly
 */
const PersonLink: React.FunctionComponent<{
  children: React.ReactNode;
  id: number;
  link?: boolean;
  orgId: string | number;
}> = ({ children, link, id, orgId }) => {
  if (link) {
    return (
      <NextLink href={`/organize/${orgId}/people/${id}`} passHref>
        <Link style={{ cursor: 'pointer' }} underline="hover">
          {children}
        </Link>
      </NextLink>
    );
  }
  return children as React.ReactElement;
};

const ZUIPerson: React.FunctionComponent<{
  containerProps?: BoxProps;
  id: number;
  link?: boolean;
  name: string;
  showText?: boolean;
  size?: number;
  subtitle?: string | React.ReactNode;
  tooltip?: boolean;
}> = ({
  containerProps,
  id,
  link,
  name,
  showText = true,
  size,
  subtitle,
  tooltip = true,
}) => {
  const { orgId } = useRouter().query as { orgId: string };

  return (
    <PersonLink id={id} link={link} orgId={orgId}>
      <Box display="flex" {...containerProps}>
        <Tooltip title={tooltip ? name : ''}>
          <Avatar
            src={orgId ? `/api/orgs/${orgId}/people/${id}/avatar` : ''}
            style={size ? { height: size, width: size } : {}}
          />
        </Tooltip>
        {showText && (
          <Box
            alignItems="start"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            ml={1}
          >
            <Typography variant="body1">{name}</Typography>
            {typeof subtitle === 'string' ? (
              <Typography variant="body2">{subtitle}</Typography>
            ) : (
              subtitle
            )}
          </Box>
        )}
      </Box>
    </PersonLink>
  );
};

export default ZUIPerson;
