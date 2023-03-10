import { useState } from 'react';

import { ZUIPreviewableMode } from 'zui/ZUIPreviewableInput';

type UseEditPreviewBlockProps = {
  editable: boolean;
  onEditModeEnter: () => void;
  onEditModeExit: () => void;
  save: () => void;
};

export default function useEditPreviewBlock({
  editable,
  save,
  onEditModeEnter,
  onEditModeExit,
}: UseEditPreviewBlockProps) {
  const [autoFocusDefault, setAutoFocusDefault] = useState(true);

  const handleSwitchMode = (newMode: ZUIPreviewableMode) => {
    if (newMode == ZUIPreviewableMode.EDITABLE) {
      setAutoFocusDefault(false);
      onEditModeEnter();
    } else {
      onEditModeExit();
    }
  };

  return {
    autoFocusDefault,
    clickAwayProps: {
      onClickAway: () => {
        if (editable) {
          onEditModeExit();
          save();
        }
      },
    },
    containerProps: {
      onClick: () => {
        if (!editable) {
          setAutoFocusDefault(true);
          onEditModeEnter();
        }
      },
    },
    previewableProps: {
      mode: editable ? ZUIPreviewableMode.EDITABLE : ZUIPreviewableMode.PREVIEW,
      onSwitchMode: handleSwitchMode,
    },
  };
}
