'use client';

import { FC } from 'react';
import { NoSsr } from '@mui/material';

import MyOrgsList from '../components/MyOrgsList';

const MyOrgsPage: FC = () => {
  return (
    <NoSsr>
      <MyOrgsList />
    </NoSsr>
  );
};

export default MyOrgsPage;
