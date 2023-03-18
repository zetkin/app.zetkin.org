import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ResponsiveBar } from '@nivo/bar';
import { useQuery } from 'react-query';
import { useState } from 'react';
import {
  Box,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@mui/material';

import APIError from 'utils/apiError';
import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import { callAssignmentQuery } from 'features/callAssignments/api/callAssignments';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import ZUIQuery from 'zui/ZUIQuery';
import { DateStats, ZetkinCaller } from 'pages/api/stats/calls/date';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, callAssId } = ctx.params!;

    await callAssignmentQuery(orgId as string, callAssId as string).prefetch(
      ctx
    );

    return {
      props: {
        assignmentId: callAssId,
        campId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: [
      'layout.organize.callAssignment',
      'pages.organizeCallAssignment',
    ],
  }
);

interface AssignmentPageProps {
  assignmentId: string;
  campId: string;
  orgId: string;
}

const AssignmentPage: PageWithLayout<AssignmentPageProps> = ({
  orgId,
  assignmentId,
}) => {
  const [caller, setCaller] = useState<number | null>(null);
  const [normalized, setNormalized] = useState(false);
  const [interval, setInterval] = useState<'date' | 'hour'>('date');

  const model = useModel(
    (env) =>
      new CallAssignmentModel(env, parseInt(orgId), parseInt(assignmentId))
  );

  const statsQuery = useQuery(
    [
      'callAssignmentStats',
      assignmentId,
      caller ? caller.toString() : 'all',
      interval,
    ],
    async () => {
      const url = `/api/stats/calls/${interval}?org=${orgId}&assignment=${assignmentId}&caller=${
        caller ? caller : ''
      }`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new APIError('get', url);
      }

      return await res.json();
    }
  );

  return (
    <>
      <Head>
        <title>{model.getData().data?.title}</title>
      </Head>
      <Typography variant="h3">Calls and conversations</Typography>
      <ZUIQuery queries={{ statsQuery }}>
        {({ queries }) => {
          const data = queries.statsQuery.data.dates.map((d: DateStats) => {
            const nonConversations = d.calls - d.conversations;

            if (normalized) {
              return {
                conversations: d.calls
                  ? Math.round((d.conversations / d.calls) * 100)
                  : 0,
                date: d.date,
                non_conversations: d.calls
                  ? Math.round((nonConversations / d.calls) * 100)
                  : 0,
              };
            } else {
              return {
                conversations: d.conversations,
                date: d.date,
                non_conversations: nonConversations,
              };
            }
          });

          const sortedCallers = queries.statsQuery.data.callers.sort(
            (c0: ZetkinCaller, c1: ZetkinCaller) =>
              c0.name.localeCompare(c1.name)
          );

          return (
            <Box>
              <Box display="flex" flexDirection="row">
                <Select
                  onChange={(ev) =>
                    setCaller(parseInt(ev.target.value as string) || null)
                  }
                  value={caller || 0}
                >
                  <MenuItem value={0}>Total</MenuItem>
                  {sortedCallers.map((caller: ZetkinCaller) => (
                    <MenuItem key={caller.id} value={caller.id}>
                      {caller.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormControlLabel
                  control={
                    <Switch
                      checked={normalized}
                      onChange={(ev) => setNormalized(ev.target.checked)}
                    />
                  }
                  label="Show as %"
                />
                <Select
                  onChange={(ev) =>
                    setInterval(ev.target.value as 'date' | 'hour')
                  }
                  value={interval}
                >
                  <MenuItem value="date">Day by day</MenuItem>
                  <MenuItem value="hour">Last 48 hours</MenuItem>
                </Select>
              </Box>
              <Box height={400}>
                <ResponsiveBar
                  key={interval}
                  axisBottom={{
                    format: (value) => {
                      if (interval == 'hour') {
                        return value.slice(-5);
                      } else {
                        return value;
                      }
                    },
                    tickPadding: 10,
                    tickRotation: -30,
                  }}
                  axisLeft={{
                    legend: 'Calls',
                    legendOffset: -50,
                    legendPosition: 'middle',
                    tickPadding: 10,
                  }}
                  colors={{ scheme: 'nivo' }}
                  data={data}
                  indexBy="date"
                  keys={['conversations', 'non_conversations']}
                  margin={{
                    bottom: 50,
                    left: 60,
                    right: 130,
                    top: 50,
                  }}
                  padding={0.3}
                />
              </Box>
            </Box>
          );
        }}
      </ZUIQuery>
    </>
  );
};

AssignmentPage.getLayout = function getLayout(page, props) {
  return (
    <CallAssignmentLayout
      assignmentId={props.assignmentId}
      campaignId={props.campId}
      orgId={props.orgId}
    >
      {page}
    </CallAssignmentLayout>
  );
};

export default AssignmentPage;
