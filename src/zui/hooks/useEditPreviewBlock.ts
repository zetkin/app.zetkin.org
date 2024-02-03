import { useState } from 'react';

import { ZUIPreviewableMode } from 'zui/ZUIPreviewableInput';

type UseEditPreviewBlockProps = {
  editable: boolean;
  onEditModeEnter: () => void;
  onEditModeExit: () => void;
  readOnly?: boolean;
  save: () => void;
};

export default function useEditPreviewBlock({
  editable,
  onEditModeEnter,
  onEditModeExit,
  readOnly,
  save,
}: UseEditPreviewBlockProps) {
  const [autoFocusDefault, setAutoFocusDefault] = useState(true);

  const handleSwitchMode = (newMode: ZUIPreviewableMode) => {
    if (newMode == ZUIPreviewableMode.EDITABLE) {
      if (!readOnly) {
        // Only allow switching if we're not in read-only mode.
        setAutoFocusDefault(false);
        onEditModeEnter();
      }
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
        if (!editable && !readOnly) {
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
