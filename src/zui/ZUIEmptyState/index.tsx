import { FC } from 'react';
import { InfoOutlined } from '@mui/icons-material';
import NextLink from 'next/link';
import { Box, Link, SvgIconTypeMap, Typography } from '@mui/material';

type ZUIEmptyStateIconProps = {
  color: SvgIconTypeMap['props']['color'];
  sx: SvgIconTypeMap['props']['sx'];
};

type ZUIEmptyStateProps = {
  href?: string;
  linkMessage?: string;
  message: string;
  renderIcon?: (props: ZUIEmptyStateIconProps) => JSX.Element;
};

const ZUIEmptyState: FC<ZUIEmptyStateProps> = ({
  renderIcon,
  message,
  linkMessage,
  href,
}) => {
  const iconProps: ZUIEmptyStateIconProps = {
    color: 'disabled',
    sx: { fontSize: '12em' },
  };

  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      paddingBottom={5}
      paddingTop={5}
    >
      {renderIcon ? renderIcon(iconProps) : <InfoOutlined {...iconProps} />}
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

export default ZUIEmptyState;
