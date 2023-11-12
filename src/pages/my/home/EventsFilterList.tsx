import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import EventSignUpList from 'features/events/components/EventSignUpList';
import { scaffold } from 'utils/next';
import { ZetkinEvent } from 'utils/types/zetkin';
import { FC, useEffect, useState } from 'react';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

type PageProps = { events: ZetkinEvent[] };

const pageSize = 5;
const Page: FC<PageProps> = ({ events }) => {
  const [page, setPage] = useState(0);
  const [eventsView, setEventsView] = useState<ZetkinEvent[]>([]);
  const length = events.length;
  useEffect(() => {
    setEventsView(events.slice(page * pageSize, (page + 1) * pageSize));
  }, [events, page]);

  function changePage(incr: number) {
    setPage((prev) => prev + incr);
  }
  const pagesAmount =
    Math.floor(length / pageSize) + (length % pageSize != 0 ? 1 : 0);

  return (
    <Box>
      {length >= pageSize && (
        <Box sx={{ alignItems: 'baseline', display: 'flex', margin: 0 }}>
          <Button disabled={page === 0} onClick={() => changePage(-1)}>
            Prev
          </Button>
          <p>
            Page {page + 1} of {pagesAmount}
          </p>
          <Button
            disabled={page >= pagesAmount - 1}
            onClick={() => changePage(1)}
          >
            Next
          </Button>
        </Box>
      )}
      <EventSignUpList events={eventsView} />
    </Box>
  );
};

export default Page;
