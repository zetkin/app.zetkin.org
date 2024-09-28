import { GetServerSideProps } from 'next';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import uniqBy from 'lodash/uniqBy';

import JoinFormSelect from 'features/joinForms/components/JoinFormSelect';
import JoinSubmissionPane from 'features/joinForms/panes/JoinSubmissionPane';
import JoinSubmissionTable from 'features/joinForms/components/JoinSubmissionTable';
import messageIds from '../../../../../features/joinForms/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import useJoinSubmissions from 'features/joinForms/hooks/useJoinSubmissions';
import { useMessages } from 'core/i18n';
import { usePanes } from 'utils/panes';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;
  return {
    props: { orgId },
  };
});

type Props = {
  orgId: string;
};

const IncomingPage: PageWithLayout<Props> = ({ orgId }) => {
  const joinSubmissions = useJoinSubmissions(parseInt(orgId));

  type FilterByStatusType = 'all' | 'pending' | 'accepted';

  const [filterByStatus, setFilterByStatus] =
    useState<FilterByStatusType>('all');
  const [filterByForm, setFilterByForm] = useState<number | undefined>();
  const messages = useMessages(messageIds);
  const { openPane } = usePanes();

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        gap={1}
        justifyContent="flex-end"
        sx={{ mr: 2, my: 2 }}
      >
        <ZUIFuture
          future={joinSubmissions}
          ignoreDataWhileLoading
          skeleton={<JoinFormSelect />}
        >
          {(submissions) => (
            <JoinFormSelect
              formId={filterByForm}
              forms={uniqBy(
                submissions.map((s) => s.form),
                'id'
              )}
              onFormSelect={(form) => setFilterByForm(form?.id)}
            />
          )}
        </ZUIFuture>

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
            <MenuItem value="pending">{messages.states.pending()}</MenuItem>
            <MenuItem value="accepted">{messages.states.accepted()}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <ZUIFuture
        future={joinSubmissions}
        ignoreDataWhileLoading
        skeleton={
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            height="100%"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        }
      >
        {(submissions) => {
          const filteredSubmissions = submissions.filter((submission) => {
            const hasFormMatches =
              filterByForm === undefined || submission.form.id === filterByForm;
            const hasStatusMatches =
              filterByStatus === 'all' || submission.state === filterByStatus;
            return hasFormMatches && hasStatusMatches;
          });

          if (filteredSubmissions.length > 0) {
            return (
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
            );
          } else {
            return (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                height="100%"
                justifyContent="center"
              >
                <ZUIEmptyState
                  message={messages.submissionList.noFilteringResults()}
                  renderIcon={(props) => <InfoOutlinedIcon {...props} />}
                />
              </Box>
            );
          }
        }}
      </ZUIFuture>
    </>
  );
};

IncomingPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default IncomingPage;
