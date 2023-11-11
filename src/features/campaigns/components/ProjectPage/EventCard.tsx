import { FC } from 'react';
import { ZetkinEvent } from 'utils/types/zetkin';

type EventCardProps = {
    data: ZetkinEvent;
}

const EventCard: FC<EventCardProps> = ({data}) => {
    return (
        <h1>{data.activity?.title}</h1>
    );
};

export default EventCard