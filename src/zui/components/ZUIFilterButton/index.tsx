import { Box, Typography } from '@mui/material';
import { FC } from 'react';

import { MUIIcon } from '../types';

type ZUIFilterButtonProps = {
  /**
   * If the filter that this button represents
   * is active or not
   */
  active: boolean;

  /**
   * If the button should be circular.
   * For example, if it only contains a Close icon.
   *
   */
  circular?: boolean;

  /**
   * The label of the component.
   * Either a string, or a MUI icon.
   */
  label: string | MUIIcon;

  /**
   * The function that runs when the filter button is clicked.
   */
  onClick: () => void;
};

const ZUIFilterButton: FC<ZUIFilterButtonProps> = ({
  active,
  circular,
  label,
  onClick,
}) => {
  const hasTextLabel = typeof label == 'string';
  const hasIconLabel = !hasTextLabel;

  const renderContent = () => {
    if (hasTextLabel) {
      return (
        <Typography
          sx={{
            maxWidth: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          variant="bodySmRegular"
        >
          {label}
        </Typography>
      );
    }

    const Icon = label;
    return <Icon sx={{ fontSize: '1.4rem' }} />;
  };

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={(theme) => ({
        alignItems: 'center',
        backgroundColor: active ? theme.palette.primary.main : 'transparent',
        border: `0.063rem solid ${theme.palette.primary.main}`,
        borderRadius: '2rem',
        color: active
          ? theme.palette.mode === 'dark'
            ? theme.palette.common.black
            : theme.palette.common.white
          : theme.palette.text.primary,
        cursor: 'pointer',
        display: 'inline-flex',
        flexShrink: 0,
        justifyContent: 'center',
        paddingX: circular ? '0.188rem' : '0.625rem',
        paddingY: hasIconLabel ? '0.188rem' : '0.25rem',
      })}
    >
      {renderContent()}
    </Box>
  );
};

export default ZUIFilterButton;
