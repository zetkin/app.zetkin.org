import { FC, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

import {
  MUIIcon,
  ZUIPrimary,
  ZUISecondary,
  ZUISize,
} from 'zui/components/types';
import ZUIIcon from 'zui/components/ZUIIcon';
import ZUILink from 'zui/components/ZUILink';

const TextVariants = {
  large: 'bodyMdRegular',
  medium: 'bodySmRegular',
  small: 'bodySmRegular',
} as const;

export type ZUILabelText =
  | string
  | {
      href: string;
      openNewTab?: boolean;
      text: string;
    };

export type ZUIIconLabelProps = {
  /**
   * The color of the icon-label pair.
   *
   * Defaults to "primary".
   */
  color?: ZUIPrimary | ZUISecondary | 'error';

  /**
   * The icon.
   *
   * Pass in reference to the icon, for example: Close, not < Close / >.
   */
  icon: MUIIcon;

  /**
   * The label
   */
  label: ZUILabelText | ZUILabelText[];

  /**
   * If true, the text will not overflow and end with an ellipsis.
   *
   * Defaults to "false".
   */
  noWrap?: boolean;

  /**
   * The size of the icon-label pair.
   *
   * Defaults to "medium."
   */
  size?: ZUISize;
};

const LabelText = ({ label }: { label: ZUILabelText }) => {
  if (typeof label === 'string') {
    return label;
  }

  return (
    <ZUILink
      hoverUnderline={true}
      href={label.href}
      openInNewTab={label.openNewTab ?? false}
      text={label.text}
      variant={'secondary'}
    />
  );
};

const ZUIIconLabel: FC<ZUIIconLabelProps> = ({
  color = 'primary',
  icon,
  label,
  noWrap = false,
  size = 'medium',
}) => {
  const labels: ReactNode[] = [];

  if (Array.isArray(label)) {
    let i = 0;

    label.forEach((text, index) => {
      if (index > 0) {
        labels.push(
          <Typography key={i} component="span" sx={{ mx: 1 }}>
            ·
          </Typography>
        );
        i++;
      }

      labels.push(<LabelText key={i} label={text} />);
      i++;
    });
  } else {
    labels.push(<LabelText key={0} label={label} />);
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexShrink: 0,
        gap: '0.5rem',
      }}
    >
      <ZUIIcon color={color} icon={icon} size={size} />
      <Typography
        color={color}
        noWrap={noWrap}
        sx={{
          flexShrink: noWrap ? '' : 0,
        }}
        variant={TextVariants[size]}
      >
        {labels}
      </Typography>
    </Box>
  );
};

export default ZUIIconLabel;
