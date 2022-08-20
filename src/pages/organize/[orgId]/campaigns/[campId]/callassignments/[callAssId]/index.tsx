import { GetServerSideProps } from 'next';
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
} from '@material-ui/core';

import APIError from 'utils/apiError';
import CallAssignmentLayout from 'layout/organize/CallAssignmentLayout';
import { callAssignmentQuery } from 'api/callAssignments';
import { DateStats } from 'pages/api/stats/calls';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import ZetkinQuery from 'components/ZetkinQuery';

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
    localeScope: ['layout.organize.callAssignment'],
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

  const statsQuery = useQuery(
    ['callAssignmentStats', assignmentId, caller ? caller.toString() : 'all'],
    async () => {
      const url = `/api/stats/calls?org=${orgId}&assignment=${assignmentId}&caller=${
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
      <Typography variant="h3">Calls and conversations</Typography>
      <ZetkinQuery queries={{ statsQuery }}>
        {({ queries }) => {
          const data = queries.statsQuery.data.dates.map((d: DateStats) => {
            const nonConversations = d.calls - d.conversations;

            if (normalized) {
              return {
                conversations: d.calls? Math.round(d.conversations / d.calls * 100) : 0,
                date: d.date,
                non_conversations: d.calls? Math.round(nonConversations / d.calls * 100) : 0,
              }
            } else {
              return {
                conversations: d.conversations,
                date: d.date,
                non_conversations: nonConversations,
              };
            }
          });

          const sortedCallers = queries.statsQuery.data.callers.sort((c0, c1) =>
            c0.name.localeCompare(c1.name)
          );

          return (
            <Box>
              <Select
                onChange={(ev) => setCaller(parseInt(ev.target.value) || null)}
                value={caller || 0}
              >
                <MenuItem value={0}>Total</MenuItem>
                {sortedCallers.map((caller) => (
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
              <Box height={400}>
                <ResponsiveBar
                  axisBottom={{
                    legend: 'Date',
                    legendOffset: 40,
                    legendPosition: 'middle',
                    tickPadding: 10,
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
      </ZetkinQuery>
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
