import { ZetkinSurvey } from 'utils/types/zetkin';
import ZUIModal from 'zui/components/ZUIModal';

type ClearResponsesModalProps = {
  onClear: () => void;
  onClose: () => void;
  open: boolean;
  survey: ZetkinSurvey;
};

const ClearResponsesModal: React.FC<ClearResponsesModalProps> = ({
  open,
  onClear,
  onClose,
  survey,
}) => {
  return (
    <ZUIModal
      open={open}
      primaryButton={{
        label: 'Clear responses',
        onClick: () => {
          onClear();
          onClose();
        },
      }}
      secondaryButton={{
        label: 'Cancel',
        onClick: () => {
          onClose();
        },
      }}
      size="small"
      title={`Do you want to remove the responses for ${survey.title} ?`}
    />
  );
};

export default ClearResponsesModal;
