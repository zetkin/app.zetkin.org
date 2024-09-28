import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

import { useNumericRouteParams } from 'core/hooks';
import { useMessages } from 'core/i18n';
import messageIds from 'features/campaigns/l10n/messageIds';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import useDateRouterParam from 'features/events/hooks/useDateRouterParam';
import QRCode from './QRCode';

function batchArray<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];

  const numBatches = Math.ceil(items.length / batchSize);

  for (let batchIndex = 0; batchIndex < numBatches; batchIndex++) {
    batches[batchIndex] = items.slice(
      batchIndex * batchSize,
      Math.min(items.length, (batchIndex + 1) * batchSize)
    );
  }

  return batches;
}

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

  const batches = batchArray(filteredEvents, 30);

  useEffect(() => {
    async function doStuff() {
      const codeReader = new BrowserQRCodeReader();
      const resultImage = await codeReader.decodeFromImageUrl(
        'http://localhost:3000/qr.jpg'
      );
      /* eslint-disable-next-line no-console */
      console.log({ resultImage });
    }

    doStuff();
  }, []);

  return (
    <>
      <Head>
        <title>{messages.layout.eventList()}</title>
      </Head>

      {batches.map((batch, index) => (
        <Box key={index} sx={{ height: '100vh' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
            <TextField
              disabled
              InputLabelProps={{ shrink: true }}
              label="Name"
              value=""
              variant="standard"
            />

            <QRCode ids={selectedEventIds} />
          </Box>

          <Table
            size="small"
            sx={{
              // Remove borders for all cells
              '& .MuiTableCell-root': {
                borderBottom: 'none',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ maxWidth: '15px' }} />
                <TableCell sx={{ maxWidth: '35px' }}>Date</TableCell>
                <TableCell>Title</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {batch.map((event) => (
                <TableRow key={event.data.id}>
                  <TableCell sx={{ maxWidth: '15px' }}>
                    <Checkbox />
                  </TableCell>
                  <TableCell sx={{ maxWidth: '35px' }}>
                    {new Date(event.data.end_time).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{event.data.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ))}

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
