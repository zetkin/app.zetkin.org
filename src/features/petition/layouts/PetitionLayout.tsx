import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

interface PetitionLayoutProps {
  orgId: string;
  projectId: string;
  petitionId: string;
  children: React.ReactNode;
}

const PetitionLayout: React.FC<PetitionLayoutProps> = ({
  orgId,
  projectId,
  petitionId,
  children,
}) => {
  const router = useRouter();

  return (
    <Box>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        borderBottom="1px solid #ddd"
      >
        <Box fontSize="1.5rem" fontWeight="bold">
          Petition #{petitionId}
        </Box>

        <Button
          variant="outlined"
          onClick={() =>
            router.push(`/organize/${orgId}/projects/${projectId}/petitions`)
          }
        >
          Back to project
        </Button>
      </Box>

      {/* CONTENT */}
      <Box p={2}>{children}</Box>
    </Box>
  );
};

export default PetitionLayout;
