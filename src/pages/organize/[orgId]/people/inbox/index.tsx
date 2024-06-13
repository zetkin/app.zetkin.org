import { GetServerSideProps } from 'next';
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

enum STATUSES {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
}

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
  const { data } = useJoinSubmissions(parseInt(orgId));
  const messages = useMessages(messageIds);
  const { openPane } = usePanes();

  if (!data) {
    return null;
  }

  const formTitles = data.map((submission) => submission.form.title);
  const uniqueFormTitles = [...new Set(formTitles)];

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        gap={1}
        justifyContent="flex-end"
        sx={{ mr: 2, my: 2 }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="demo-simple-select-label">
            {messages.submissionPane.forms()}
          </InputLabel>
          <Select
            id="demo-simple-select"
            label={messages.submissionPane.forms()}
            labelId="demo-simple-select-label"
            placeholder={messages.submissionPane.forms()}
          >
            <MenuItem value={'all'}>
              {messages.submissionPane.allForms()}
            </MenuItem>
            {uniqueFormTitles.map((title, index) => (
              <MenuItem key={index} value={title}>
                {title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="demo-simple-select-label">
            {messages.submissionPane.status()}
          </InputLabel>
          <Select
            id="demo-simple-select"
            label={messages.submissionPane.status()}
            labelId="demo-simple-select-label"
            placeholder={messages.submissionPane.status()}
          >
            <MenuItem value={'all'}>
              {messages.submissionPane.allStatuses()}
            </MenuItem>
            {Object.values(STATUSES).map((status) => (
              <MenuItem key={status} value={status}>
                {messages.submissionPane.states[status]()}
              </MenuItem>
            ))}
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
        submissions={data}
      />
    </>
  );
};

DuplicatesPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default DuplicatesPage;
