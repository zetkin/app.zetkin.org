import ClickableCard from './ClickableCard';
import ZUIJourneyInstanceItem, {
  ZUIJourneyInstanceItemProps,
} from '../ZUIJourneyInstanceItem';

interface ZUIJourneyInstanceCardProps {
  instance: ZUIJourneyInstanceItemProps['instance'];
  orgId: number | string;
}

const ZUIJourneyInstanceCard: React.FC<ZUIJourneyInstanceCardProps> = ({
  instance,
  orgId,
}) => {
  return (
    <ClickableCard>
      <ZUIJourneyInstanceItem instance={instance} orgId={orgId} />
    </ClickableCard>
  );
};

export default ZUIJourneyInstanceCard;
