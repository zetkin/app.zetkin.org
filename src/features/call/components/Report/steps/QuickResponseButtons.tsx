import {
  Looks3Outlined,
  Looks4Outlined,
  LooksOneOutlined,
  LooksTwoOutlined,
} from '@mui/icons-material';
import { FC, useEffect } from 'react';
import { Stack } from '@mui/system';

import ZUIButtonGroup from '../../../../../zui/components/ZUIButtonGroup';
import useIsMobile from '../../../../../utils/hooks/useIsMobile';
import ZUIButton from '../../../../../zui/components/ZUIButton';

type QuickResponseProps = {
  options: Option[];
};

export interface Option {
  onSelect: () => void | Promise<void>;
  label: string;
}

export const QuickResponseButtons: FC<QuickResponseProps> = ({ options }) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    const optionCount = options.length;
    const onKeyDown = (ev: KeyboardEvent) => {
      const pressedNumber = Number.parseInt(ev.key);
      if (!Number.isNaN(pressedNumber) && pressedNumber <= optionCount) {
        options[pressedNumber - 1].onSelect();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const numberButtons = [
    LooksOneOutlined,
    LooksTwoOutlined,
    Looks3Outlined,
    Looks4Outlined,
  ];

  if (options.length === 2) {
    return (
      <ZUIButtonGroup
        buttons={options.map((option, index) => ({
          endIcon: !isMobile ? numberButtons[index] : undefined,
          label: option.label,
          onClick: option.onSelect,
        }))}
        fullWidth
        variant="secondary"
      />
    );
  }

  return (
    <Stack sx={{ alignItems: 'flex-start', gap: '0.5rem' }}>
      {options.map((option, index) => (
        <ZUIButton
          key={option.label}
          endIcon={!isMobile ? numberButtons[index] : undefined}
          label={option.label}
          onClick={option.onSelect}
          variant="secondary"
        />
      ))}
    </Stack>
  );
};
