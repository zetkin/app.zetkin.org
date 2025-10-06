'use client';

import { FC, Suspense, useState } from 'react';
import { Box } from '@mui/material';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import RegisterFormSection from '../components/RegisterFormSection';
import RegisterSuccessSection from '../components/RegisterSuccessSection';

const RegisterPage: FC = () => {
  const [success, setSuccess] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
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
      {success && userName && email ? (
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
