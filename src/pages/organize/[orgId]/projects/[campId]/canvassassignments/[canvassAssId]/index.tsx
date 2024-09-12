import { GetServerSideProps } from 'next';
import { FC, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

import useCanvassAssignment from 'features/areas/hooks/useCanvassAssignment';
import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useAddIndividualCanvassAssignment from 'features/areas/hooks/useAddIndividualCanvassAssignment';
import useIndividualCanvassAssignments from 'features/areas/hooks/useIndividualCanvassAssignments';
import ZUIFutures from 'zui/ZUIFutures';
import useIndividualCanvassAssignmentMutations from 'features/areas/hooks/useIndividualCanvassAssignmentMutations';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, canvassAssId } = ctx.params!;
  return {
    props: { campId, canvassAssId, orgId },
  };
}, scaffoldOptions);

const IndividualCanvassAssignmentListItem: FC<{
  individualCanvassAssId: string;
  onAddUrl: (url: string) => void;
}> = ({ individualCanvassAssId, onAddUrl }) => {
  const [url, setUrl] = useState('');
  return (
    <Box alignItems="center" display="flex" gap={1}>
      <Typography>{individualCanvassAssId}</Typography>
      <TextField onChange={(ev) => setUrl(ev.target.value)} value={url} />
      <Button
        disabled={!url}
        onClick={() => {
          if (url) {
            onAddUrl(url);
          }
        }}
        variant="outlined"
      >
        Add this area url
      </Button>
    </Box>
  );
};

interface CanvassAssignmentPageProps {
  orgId: string;
  campId: string;
  canvassAssId: string;
}

const CanvassAssignmentPage: PageWithLayout<CanvassAssignmentPageProps> = ({
  orgId,
  campId,
  canvassAssId,
}) => {
  const [personId, setPersonId] = useState<number | null>(null);

  const addIndividualCanvassAss = useAddIndividualCanvassAssignment(
    parseInt(orgId),
    parseInt(campId),
    canvassAssId
  );

  const updateIndividualCanvassAss = useIndividualCanvassAssignmentMutations(
    parseInt(orgId),
    parseInt(campId),
    canvassAssId
  );

  const canvassAssignmentFuture = useCanvassAssignment(
    parseInt(orgId),
    parseInt(campId),
    canvassAssId
  );

  const individualCanvassAssignmentsFuture = useIndividualCanvassAssignments(
    parseInt(orgId),
    parseInt(campId),
    canvassAssId
  );
  return (
    <ZUIFutures
      futures={{
        canvassAssignment: canvassAssignmentFuture,
        individualCanvassAssignments: individualCanvassAssignmentsFuture,
      }}
    >
      {({ data: { canvassAssignment, individualCanvassAssignments } }) => {
        return (
          <Box>
            {canvassAssignment.title}
            <Box display="flex" flexDirection="column">
              <Typography>Add a person Id</Typography>
              <TextField
                onChange={(ev) => {
                  const value = ev.target.value;
                  if (value) {
                    setPersonId(parseInt(value));
                  }
                }}
                type="number"
                value={personId}
              />
              <Button
                onClick={() => {
                  if (personId) {
                    addIndividualCanvassAss(personId);
                  }
                }}
                variant="contained"
              >
                Add person (create indiviual canvass assignment)
              </Button>
            </Box>
            <Box>
              Ids of people that have been added
              {individualCanvassAssignments.map((individualCanvassAss) => (
                <IndividualCanvassAssignmentListItem
                  key={individualCanvassAss.id}
                  individualCanvassAssId={individualCanvassAss.id}
                  onAddUrl={(url) =>
                    updateIndividualCanvassAss(individualCanvassAss.personId, {
                      areaUrl: url,
                    })
                  }
                />
              ))}
            </Box>
          </Box>
        );
      }}
    </ZUIFutures>
  );
};

CanvassAssignmentPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentPage;
