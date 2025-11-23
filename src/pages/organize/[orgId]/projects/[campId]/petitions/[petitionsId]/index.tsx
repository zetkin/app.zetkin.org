import { Box } from '@mui/material';
import PetitionLayout from 'features/petition/layouts/PetitionLayout';
import Head from 'next/head';
import { PageWithLayout } from 'utils/types';

// Props type
interface PetitionPageProps {
  projectId: string;
  orgId: string;
  petitionId: string;
}

// Minimal PetitionPage with mock data
const PetitionPage: PageWithLayout<PetitionPageProps> = ({
  projectId,
  orgId,
  petitionId,
}) => {
  const petition = {
    id: Number(petitionId),
    title: 'Mock Petition Title',
    description: 'This is a mock petition description.',
    signature: 'require_signature' as const,
    created_at: new Date().toISOString(),
    organization: {
      id: Number(orgId),
      title: `Org #${orgId}`,
    },
    project: {
      id: Number(projectId),
      title: `Project #${projectId}`,
    },
  };

  return (
    <>
      <Head>
        <title>{petition.title}</title>
      </Head>
      <Box p={2}>
        <h1>{petition.title}</h1>
        <p>{petition.description}</p>
        <p>
          Organization: {petition.organization?.title} | Project:{' '}
          {petition.project?.title}
        </p>
      </Box>
    </>
  );
};

PetitionPage.getLayout = function getLayout(page, props) {
  // TODO
  return (
    <PetitionLayout
      projectId={props.projectId}
      orgId={props.orgId}
      petitionId={props.petitionId}
    >
      {page}
    </PetitionLayout>
  );
};

export default PetitionPage;
