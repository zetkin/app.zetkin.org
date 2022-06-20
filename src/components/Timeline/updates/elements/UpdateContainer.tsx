import TimelineActor from 'components/Timeline/TimelineActor';
import UpdateHeader from './UpdateHeader';
import { ZetkinUpdate } from 'types/updates';

interface UpdateContainerProps {
  actionButton?: React.ReactNode;
  headerContent: React.ReactNode;
  update: ZetkinUpdate;
}

const UpdateContainer: React.FC<UpdateContainerProps> = ({
  children,
  actionButton,
  headerContent,
  update,
}) => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'grid',
        gap: 10,
        gridAutoRows: 'auto',
        gridTemplateColumns: 'auto 1fr auto',
      }}
    >
      <TimelineActor actor={update.actor} size={32} />
      <UpdateHeader timestamp={update.timestamp}>{headerContent}</UpdateHeader>
      {actionButton || null}
      {children && (
        <>
          <div style={{ gridColumn: '2 / end' }}>{children}</div>
        </>
      )}
    </div>
  );
};

export default UpdateContainer;
