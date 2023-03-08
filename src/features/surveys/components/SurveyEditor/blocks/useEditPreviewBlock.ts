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
  const handleSwitchMode = (newMode: ZUIPreviewableMode) => {
    if (newMode == ZUIPreviewableMode.EDITABLE) {
      onEditModeEnter();
    } else {
      onEditModeExit();
    }
  };

  return {
    clickAwayProps: {
      onClickAway: () => {
        if (editable) {
          onEditModeExit();
          save();
        }
      },
    },
    previewableProps: {
      mode: editable ? ZUIPreviewableMode.EDITABLE : ZUIPreviewableMode.PREVIEW,
      onSwitchMode: handleSwitchMode,
    },
  };
}
