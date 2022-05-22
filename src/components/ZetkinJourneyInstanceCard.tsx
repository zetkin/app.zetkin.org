import ClickableCard from './views/SuggestedViews/ClickableCard';
import ZetkinJourneyInstanceItem, {
  ZetkinJourneyInstanceItemProps,
} from './ZetkinJourneyInstanceItem';

interface ZetkinJourneyInstanceCardProps {
  instance: ZetkinJourneyInstanceItemProps['instance'];
  orgId: number | string;
}

const ZetkinJourneyInstanceCard: React.FC<ZetkinJourneyInstanceCardProps> = ({
  instance,
  orgId,
}) => {
  return (
    <ClickableCard>
      <ZetkinJourneyInstanceItem instance={instance} orgId={orgId} />
    </ClickableCard>
  );
};

export default ZetkinJourneyInstanceCard;
