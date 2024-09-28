import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import { useMessages } from 'core/i18n';
import messageIds from 'features/campaigns/l10n/messageIds';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import { useNumericRouteParams } from 'core/hooks';
import useDateRouterParam from 'features/events/hooks/useDateRouterParam';
import { Box } from '@mui/system';

const EventList: FC<{ orgId: number }> = ({ orgId }) => {
  const router = useRouter();
  const messages = useMessages(messageIds);

  const selectedEventIds = useMemo(() => {
    const { ids } = router.query;
    if (typeof ids !== 'string') {
      return [];
    }

    const parsedIds = ids.split(',').map((x) => Number(x));

    return parsedIds;
  }, [router.query]);

  const endDate = useDateRouterParam('maxDate') || new Date();
  const startDate = useDateRouterParam('minDate') || new Date();

  const filteredEvents = useEventsFromDateRange(
    startDate,
    endDate,
    orgId
  ).filter((x) => selectedEventIds.includes(x.data.id));

  return (
    <>
      <Head>
        <title>{messages.layout.eventList()}</title>
      </Head>

      <Box sx={{ display: 'flex', p: 2, justifyContent: 'flex-end' }}>
        <TextField
          disabled
          InputLabelProps={{ shrink: true }}
          label="Name"
          value=""
          variant="standard"
        />
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ maxWidth: '10px' }} />
            <TableCell sx={{ maxWidth: '15px' }}>Date</TableCell>
            <TableCell>Title</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredEvents.map((event) => (
            <TableRow key={event.data.id}>
              <TableCell sx={{ maxWidth: '10px' }}>
                <Checkbox />
              </TableCell>
              <TableCell sx={{ maxWidth: '15px' }}>
                {new Date(event.data.end_time).toLocaleDateString()}
              </TableCell>
              <TableCell>{event.data.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedEventIds.length === 0 && <p>No events selected.</p>}
    </>
  );
};

const Wrapper = () => {
  const { orgId } = useNumericRouteParams();
  if (!orgId) {
    return;
  }

  return <EventList orgId={orgId} />;
};

export default Wrapper;
