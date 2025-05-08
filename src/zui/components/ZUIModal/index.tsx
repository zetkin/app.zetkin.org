import { FC, ReactNode } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

import { ZUISize } from '../types';
import MobileModal from './MobileModal';
import DesktopModal from './DesktopModal';

type ButtonBase = {
  label: string;
};

type OnClickButton = ButtonBase & {
  onClick: () => void;
};

type HrefButton = ButtonBase & {
  href: string;
};

export type ZUIModalProps = {
  /**
   * The content of the modal.
   */
  children?: ReactNode;

  /**
   * If provided the user will be able to close the modal by
   *  clicking X-icon in corner, or outside the modal.
   */
  onClose?: () => void;

  /**
   * Determines whether the modal is open.
   */
  open: boolean;

  /**
   * The primary action button in the modal header.
   */
  primaryButton: OnClickButton | HrefButton;

  /**
   * The secondary action button in the modal header.
   */
  secondaryButton?: OnClickButton | HrefButton;

  /**
   * The size of the modal.
   * Small, medium and large are fixed width.
   * Full is fixed width and height.
   * Auto adjusts width and height to content.
   *
   * Defaults to "auto".
   */
  size?: ZUISize | 'auto' | 'full';

  /**
   * The title of the modal.
   */
  title: string;
};

const ZUIModal: FC<ZUIModalProps> = ({
  open,
  primaryButton,
  title,
  onClose,
  children,
  secondaryButton,
  size,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return isMobile ? (
    <MobileModal
      onClose={onClose}
      open={open}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      title={title}
    >
      {children}
    </MobileModal>
  ) : (
    <DesktopModal
      onClose={onClose}
      open={open}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      size={size}
      title={title}
    >
      {children}
    </DesktopModal>
  );
};

export default ZUIModal;
