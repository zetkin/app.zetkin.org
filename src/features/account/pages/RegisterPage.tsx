'use client';

import { FC, Suspense, useState } from 'react';
import { Box } from '@mui/material';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import RegisterFormSection from '../components/RegisterFormSection';
import RegisterSuccessSection from '../components/RegisterSuccessSection';

const RegisterPage: FC = () => {
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  const successfullyRegistered = success && userName && email;

  return (
    <Suspense
      fallback={
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          height="90dvh"
          justifyContent="center"
        >
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
      {successfullyRegistered ? (
        <RegisterSuccessSection email={email} userName={userName} />
      ) : (
        <RegisterFormSection
          onSuccess={(newUserName, newEmail) => {
            setUserName(newUserName);
            setEmail(newEmail);
            setSuccess(true);
          }}
        />
      )}
    </Suspense>
  );
};

export default RegisterPage;
