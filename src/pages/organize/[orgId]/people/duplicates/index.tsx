import { GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';

import ConfigureModal from 'features/duplicates/components/ConfigureModal';
import messageIds from 'features/duplicates/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
//import useDuplicates from 'features/duplicates/hooks/useDuplicates';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import { ZetkinDuplicate } from 'features/duplicates/store';

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
});

const DuplicatesPage: PageWithLayout = () => {
  const onServer = useServerSide();
  //const list = useDuplicates().data ?? [];
  const list: ZetkinDuplicate[] = [
    {
      dismissed: null,
      duplicatePersons: [
        {
          alt_phone: '',
          city: 'Oakland',
          co_address: '',
          country: 'USA',
          email: 'angela@blackpanthers.org',
          ext_id: '74',
          first_name: 'Angel',
          gender: 'f',
          id: 2,
          is_user: false,
          last_name: 'Davidsson',
          phone: '0018493298448',
          street_address: '45 Main Street',
          zip_code: '34910',
        },
        {
          alt_phone: '',
          city: 'Linköping',
          co_address: '',
          country: 'USA',
          email: 'haeju@blackpanthers.org',
          ext_id: '74',
          first_name: 'Haeju',
          gender: 'f',
          id: 2,
          is_user: false,
          last_name: 'Eom',
          phone: '0018493298448',
          street_address: '45 Main Street',
          zip_code: '34910',
        },
        {
          alt_phone: '',
          city: 'Oakland',
          co_address: '',
          country: 'USA',
          email: 'angela@blackpanthers.org',
          ext_id: '74',
          first_name: 'Angela',
          gender: 'f',
          id: 2,
          is_user: false,
          last_name: 'Davis',
          phone: '0018493298449',
          street_address: '45 Main Street',
          zip_code: '34910',
        },
      ],
      id: 100,
      merged: null,
      organization: {
        id: 1,
        title: 'My Organization',
      },
      status: 'pending',
    },
  ];
  const messages = useMessages(messageIds);

  if (onServer) {
    return null;
  }

  return (
    <>
      {list.length === 0 && (
        <Box m={2}>
          <Typography variant="overline">
            {messages.page.noDuplicates()}
          </Typography>
          <Typography variant="body1">
            {messages.page.noDuplicatesDescription()}
          </Typography>
        </Box>
      )}
      <ConfigureModal duplicate={list[0]} onClose={() => {}} open={true} />
    </>
  );
};

DuplicatesPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default DuplicatesPage;
