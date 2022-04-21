import { ZetkinUpdate } from 'types/zetkin';

export interface TimelineProps {
  showAll?: boolean;
  updates: ZetkinUpdate[];
}

export const SHOW_INITIALLY = 5;

const Timeline: React.FunctionComponent<TimelineProps> = ({
  showAll,
  updates,
}) => {
  return (
    <div>
      {(showAll ? updates : updates.slice(0, SHOW_INITIALLY)).map((update) => (
        <div key={update.created_at + update.type} aria-label="timeline update">
          <p>{update.actor?.first_name}</p>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
