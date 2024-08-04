import TimelineActor from 'zui/ZUITimeline/TimelineActor';
import UpdateHeader from './UpdateHeader';
import { ZetkinUpdate } from 'zui/ZUITimeline/types';

interface UpdateContainerProps {
  actionButton?: React.ReactNode;
  children?: React.ReactNode;
  headerContent: React.ReactNode;
  update: ZetkinUpdate;
}

const UpdateContainer: React.FC<UpdateContainerProps> = ({
  actionButton,
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
        gridTemplateColumns: 'auto 1fr auto',
      }}
    >
      <TimelineActor actor={update.actor} size={32} />
      <UpdateHeader timestamp={update.timestamp}>{headerContent}</UpdateHeader>
      {actionButton || null}
      {children && (
        <div style={{ gridColumn: '2 / end', overflowWrap: 'anywhere' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default UpdateContainer;
