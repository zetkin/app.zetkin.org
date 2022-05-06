import { useRouter } from 'next/router';
import { Avatar, Box, BoxProps, Tooltip, Typography } from '@material-ui/core';

const ZetkinPerson: React.FunctionComponent<{
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
  const router = useRouter();
  const { orgId } = router.query;
  const linkProps = {
    component: 'a',
    href: `/organize/${orgId}/people/${id}`,
  };

  return (
    <Box display="flex" {...containerProps}>
      {tooltip ? (
        <Tooltip title={name}>
          <Avatar
            {...(link ? linkProps : {})}
            src={orgId ? `/api/orgs/${orgId}/people/${id}/avatar` : ''}
            style={size ? { height: size, width: size } : {}}
          />
        </Tooltip>
      ) : (
        <Avatar
          {...(link ? linkProps : {})}
          src={orgId ? `/api/orgs/${orgId}/people/${id}/avatar` : ''}
          style={size ? { height: size, width: size } : {}}
        />
      )}
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
  );
};

export default ZetkinPerson;
