import TimelineActor from 'zui/Timeline/TimelineActor';
import UpdateHeader from './UpdateHeader';
import { ZetkinUpdate } from 'zui/Timeline/updates/types';

interface UpdateContainerProps {
  headerContent: React.ReactNode;
  update: ZetkinUpdate;
}

const UpdateContainer: React.FC<UpdateContainerProps> = ({
  children,
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
        gridTemplateColumns: 'auto 1fr',
      }}
    >
      <TimelineActor actor={update.actor} size={32} />
      <UpdateHeader timestamp={update.timestamp}>{headerContent}</UpdateHeader>
      {children && (
        <>
          <div style={{ gridColumn: '2 / end' }}>{children}</div>
        </>
      )}
    </div>
  );
};

export default UpdateContainer;
