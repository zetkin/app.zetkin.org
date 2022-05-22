import ClickableCard from './views/SuggestedViews/ClickableCard';
import ZetkinJourneyInstanceItem, {
  ZetkinJourneyInstanceItemProps,
} from './ZetkinJourneyInstanceItem';

interface ZetkinJourneyInstanceCardProps {
  instance: ZetkinJourneyInstanceItemProps['instance'];
}

const ZetkinJourneyInstanceCard: React.FC<ZetkinJourneyInstanceCardProps> = ({
  instance,
}) => {
  return (
    <ClickableCard>
      <ZetkinJourneyInstanceItem instance={instance} />
    </ClickableCard>
  );
};

export default ZetkinJourneyInstanceCard;
