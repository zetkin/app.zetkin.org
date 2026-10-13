import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { getPersonScaffoldProps } from '..';
import { scaffold } from 'utils/next';
import usePerson from 'features/profile/hooks/usePerson';
import { useMessages } from 'core/i18n';
import messageIds from 'features/profile/l10n/messageIds';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import { PageWithLayout } from 'utils/types';
import usePersonCalls from 'features/profile/hooks/usePersonCalls';
import ZUIFuture from 'zui/ZUIFuture';

export const getServerSideProps: GetServerSideProps = scaffold(
  getPersonScaffoldProps,
  { authLevelRequired: 2 }
);

type Props = {
  orgId: string;
  personId: string;
};

const PersonCallsPage: PageWithLayout<Props> = ({ orgId, personId }) => {
  const messages = useMessages(messageIds);
  const { data: person } = usePerson(+orgId, +personId);
  const personCallsFuture = usePersonCalls(+orgId, +personId);

  if (!person) {
    return null;
  }
  return (
    <>
      <Head>
        <title>
          {person.first_name} {person.last_name} - {messages.tabs.calls()}
        </title>
      </Head>
      <ZUIFuture future={personCallsFuture}>
        {(calls) => {
          return (
            <>
              {calls.map((call) => (
                <Box key={call.id}>{call.allocation_time}</Box>
              ))}
            </>
          );
        }}
      </ZUIFuture>
    </>
  );
};

PersonCallsPage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonCallsPage;
