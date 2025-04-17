import { FC } from 'react';
import { Box, Divider, Switch, Typography, useTheme } from '@mui/material';
import { Check, Close } from '@mui/icons-material';

import ZUICard from 'zui/ZUICard';

type TipsSection = {
  bullets: string[];
  header: string;
  iconType: 'check' | 'close';
};

type ZUILockCardProps = {
  isActive: boolean;
  lockedHeader: string;
  lockedSubheader: string;
  onToggle: (newValue: boolean) => void;
  tips: {
    safe: TipsSection;
    unsafe: TipsSection;
  };
  unlockedHeader: string;
  unlockedSubheader: string;
};

const ZUILockCard: FC<ZUILockCardProps> = ({
  isActive,
  lockedHeader,
  lockedSubheader,
  onToggle,
  tips,
  unlockedHeader,
  unlockedSubheader,
}) => {
  const theme = useTheme();

  const renderTips = (section: TipsSection) => {
    const icon =
      section.iconType === 'check' ? (
        <Check style={{ color: theme.palette.success.main }} />
      ) : (
        <Close color="error" />
      );

    return (
      <Box mt={1}>
        <Typography mb={1} sx={{ fontWeight: 'bold' }}>
          {section.header}
        </Typography>
        {section.bullets.map((text) => (
          <Box key={text} alignItems="flex-start" display="flex">
            <Box mr={1}>{icon}</Box>
            <Typography>{text}</Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <ZUICard
      header={isActive ? unlockedHeader : lockedHeader}
      status={
        <Switch checked={!isActive} onChange={() => onToggle(!isActive)} />
      }
      subheader={isActive ? unlockedSubheader : lockedSubheader}
      sx={{ mb: 2 }}
    >
      {isActive && (
        <>
          <Divider />
          {renderTips(tips.safe)}
          {renderTips(tips.unsafe)}
        </>
      )}
    </ZUICard>
  );
};

export default ZUILockCard;
