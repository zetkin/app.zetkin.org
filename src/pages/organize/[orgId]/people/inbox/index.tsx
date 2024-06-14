import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import JoinSubmissionPane from 'features/joinForms/panes/JoinSubmissionPane';
import JoinSubmissionTable from 'features/joinForms/components/JoinSubmissionTable';
import messageIds from '../../../../../features/joinForms/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import useJoinSubmissions from 'features/joinForms/hooks/useJoinSubmissions';
import { useMessages } from 'core/i18n';
import { usePanes } from 'utils/panes';

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;
  return {
    props: { orgId },
  };
});

type Props = {
  orgId: string;
};

const DuplicatesPage: PageWithLayout<Props> = ({ orgId }) => {
  const { data: submissions } = useJoinSubmissions(parseInt(orgId));

  type FilterByStatusType = 'all' | 'pending' | 'accepted';

  const [filterByStatus, setFilterByStatus] =
    useState<FilterByStatusType>('all');
  const [filterByForm, setFilterByForm] = useState('all');
  const messages = useMessages(messageIds);
  const { openPane } = usePanes();

  if (!submissions) {
    return null;
  }

  const formTitles = submissions.map((submission) => submission.form.title);
  const uniqueFormTitles = [...new Set(formTitles)];

  const filteredSubmissions = submissions.filter((submission) => {
    const hasFormMatches =
      filterByForm === 'all' || submission.form.title === filterByForm;
    const hasStatusMatches =
      filterByStatus === 'all' || submission.state === filterByStatus;
    return hasFormMatches && hasStatusMatches;
  });

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        gap={1}
        justifyContent="flex-end"
        sx={{ mr: 2, my: 2 }}
      >
        {/* filter by form name */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{messages.forms()}</InputLabel>
          <Select
            label={messages.forms()}
            onChange={(event) => setFilterByForm(event.target.value)}
            placeholder={messages.forms()}
            value={filterByForm}
          >
            <MenuItem selected value={'all'}>
              {messages.submissionPane.allForms()}
            </MenuItem>
            {uniqueFormTitles.map((title, index) => (
              <MenuItem key={index} value={title}>
                {title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* filter by form submission status */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>{messages.status()}</InputLabel>
          <Select
            label={messages.status()}
            onChange={(event) => {
              setFilterByStatus(event.target.value as FilterByStatusType);
            }}
            placeholder={messages.status()}
            value={filterByStatus}
          >
            <MenuItem selected value="all">
              {messages.submissionPane.allStatuses()}
            </MenuItem>
            <MenuItem value="pending">
              {messages.submissionPane.states.pending()}
            </MenuItem>
            <MenuItem value="accepted">
              {messages.submissionPane.states.accepted()}
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <JoinSubmissionTable
        onSelect={(submission) => {
          openPane({
            render: () => (
              <JoinSubmissionPane
                orgId={parseInt(orgId)}
                submissionId={submission.id}
              />
            ),
            width: 500,
          });
        }}
        orgId={parseInt(orgId)}
        submissions={filteredSubmissions}
      />
    </>
  );
};

DuplicatesPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default DuplicatesPage;
