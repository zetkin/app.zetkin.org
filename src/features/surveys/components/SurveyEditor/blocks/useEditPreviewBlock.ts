import { useState } from 'react';
import { ZUIPreviewableMode } from 'zui/ZUIPreviewableInput';

type UseEditPreviewBlockProps = {
  onEditModeEnter: () => void;
  onEditModeExit: () => void;
  save: () => void;
};

export default function useEditPreviewBlock({
  save,
  onEditModeEnter,
  onEditModeExit,
}: UseEditPreviewBlockProps) {
  const [mode, setMode] = useState(ZUIPreviewableMode.PREVIEW);

  const handleSwitchMode = (newMode: ZUIPreviewableMode) => {
    setMode(newMode);
    if (newMode == ZUIPreviewableMode.EDITABLE) {
      onEditModeEnter();
    }
  };

  return {
    clickAwayProps: {
      onClickAway: () => {
        if (mode == ZUIPreviewableMode.EDITABLE) {
          setMode(ZUIPreviewableMode.PREVIEW);
          onEditModeExit();
          save();
        }
      },
    },
    editing: mode == ZUIPreviewableMode.EDITABLE,
    mode,
    previewableProps: {
      mode,
      onSwitchMode: handleSwitchMode,
    },
  };
}
