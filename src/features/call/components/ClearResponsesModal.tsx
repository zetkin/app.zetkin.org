import { ZetkinSurvey } from 'utils/types/zetkin';
import ZUIModal from 'zui/components/ZUIModal';
import { useSurveysKeysMutations } from '../hooks/useSurveysKeysMutations';

type ClearResponsesModalProps = {
  onClose: () => void;
  open: boolean;
  survey: ZetkinSurvey;
  targetId: number;
};

const ClearResponsesModal: React.FC<ClearResponsesModalProps> = ({
  open,
  onClose,
  survey,
  targetId,
}) => {
  const { clearSurveyResponses } = useSurveysKeysMutations();
  return (
    <ZUIModal
      open={open}
      primaryButton={{
        label: 'Clear responses',
        onClick: () => {
          clearSurveyResponses(survey.id, targetId);
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
