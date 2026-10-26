'use client';

import { Box, NoSsr } from '@mui/material';
import { FC } from 'react';

import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  name: string;
  numbers: string[];
};

const CompanionPage: FC<Props> = ({ name, numbers }) => {
  return (
    <NoSsr>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <ZUIText variant="headingLg">{name}</ZUIText>
        {numbers.map((number) => {
          const href = `tel:${number}`;
          return (
            <Box key={number}>
              <ZUIButton
                href={href}
                label={number}
                size="large"
                variant="primary"
              />
            </Box>
          );
        })}
      </Box>
    </NoSsr>
  );
};

export default CompanionPage;
