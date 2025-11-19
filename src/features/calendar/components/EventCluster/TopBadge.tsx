import { FC } from 'react';
import { Box } from '@mui/material';

interface TopBadgeProps {
  cancelled: boolean;
  draft: boolean;
  icon: JSX.Element;
  text: string;
}

const TopBadge: FC<TopBadgeProps> = ({ cancelled, draft, icon, text }) => {
  return (
    <Box
      sx={(theme) => ({
        alignItems: 'center',
        backgroundColor:
          cancelled || draft
            ? theme.palette.secondary.main
            : theme.palette.primary.main,
        borderLeft: `1px solid ${theme.palette.grey[300]}`,
        borderRight: `1px solid ${theme.palette.grey[300]}`,
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        left: 0,
        padding: '0 8px',
        position: 'absolute',
        top: 0,
        transform: 'translateY(-100%) translateX(-1px)',
        width: 40,
      })}
    >
      {icon}
      <span>{text}</span>
    </Box>
  );
};

export default TopBadge;
