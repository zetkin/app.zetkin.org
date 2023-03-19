import { FC } from 'react';
import { InfoOutlined } from '@mui/icons-material';
import { Box, SvgIconTypeMap, Typography } from '@mui/material';

type ZUIEmptyStateIconProps = {
  color: SvgIconTypeMap['props']['color'];
  sx: SvgIconTypeMap['props']['sx'];
};

type ZUIEmptyStateProps = {
  message: string;
  renderIcon?: (props: ZUIEmptyStateIconProps) => JSX.Element;
};

const ZUIEmptyState: FC<ZUIEmptyStateProps> = ({ renderIcon, message }) => {
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
    </Box>
  );
};

export default ZUIEmptyState;
