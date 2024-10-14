import { GetServerSideProps } from 'next';
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  TextField,
  Typography,
} from '@mui/material';

import { AREAS } from 'utils/featureFlags';
import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useCanvassAssignmentMutations from 'features/areas/hooks/useCanvassAssignmentMutations';
import useCanvassAssignment from 'features/areas/hooks/useCanvassAssignment';
import { ZetkinCanvassAssignment } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [AREAS],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, canvassAssId } = ctx.params!;
  return {
    props: { campId, canvassAssId, orgId },
  };
}, scaffoldOptions);

interface CanvassAssignmentEditorProps {
  orgId: string;
  canvassAssId: string;
}

export type ZetkinAssignmentMetrics = Omit<
  ZetkinCanvassAssignment,
  Exclude<keyof ZetkinCanvassAssignment, 'metrics'>
>;

const CanvassAssignmentEditorPage: PageWithLayout<
  CanvassAssignmentEditorProps
> = ({ orgId, canvassAssId }) => {
  const updateCanvassAssignment = useCanvassAssignmentMutations(
    parseInt(orgId),
    canvassAssId
  );
  const canvassFuture = useCanvassAssignment(parseInt(orgId), canvassAssId);

  const [booleanTitle, setBooleanTitle] = useState<string>('');
  const [booleanDescription, setBooleanDescription] = useState<string>('');
  const [booleanQuestion, setBooleanQuestion] = useState<boolean>(false);

  const handleAddQuestion = () => {
    setBooleanQuestion(true);
  };

  return (
    <>
      <Typography>
        Here you can configure the questions for your canvass assignment
      </Typography>
      <Box alignItems="center" display="flex" mt={2}>
        <Button
          onClick={handleAddQuestion}
          sx={{ marginRight: 1 }}
          variant="contained"
        >
          Add new question yes/no type
        </Button>
        <Button variant="contained"> Add new question scale type</Button>
      </Box>
      {/** BOOLEAN QUESTION */}
      {booleanQuestion && (
        <Card sx={{ marginTop: 2 }}>
          <CardContent>
            <Typography gutterBottom variant="h5">
              Yes/No Question
            </Typography>
            <Box display="flex" flexDirection="column">
              <TextField
                label="Title"
                onChange={(ev) => setBooleanTitle(ev.target.value)}
                sx={{ marginBottom: 1 }}
                variant="outlined"
              />
              <TextField
                label="Description"
                onChange={(ev) => setBooleanDescription(ev.target.value)}
                sx={{ marginBottom: 1 }}
                variant="outlined"
              />
              <Box alignItems="center" display="flex">
                <Typography>
                  Answering this question defines the goal of the assignment?
                </Typography>
                <Checkbox />
              </Box>
              <Button
                onClick={() => {
                  updateCanvassAssignment({
                    metrics: [
                      {
                        definesDone: false,
                        description: booleanDescription,
                        id: '',
                        kind: 'boolean',
                        question: booleanTitle,
                      },
                    ],
                  });
                  setBooleanQuestion(false);
                }}
              >
                SAVE
              </Button>
              <Button>DELETE</Button>
            </Box>
          </CardContent>
        </Card>
      )}
      <ZUIFuture future={canvassFuture}>
        {(data) => (
          <Box mt={3}>
            Your list of questions:
            {data.metrics.map((metric) => (
              <Card key={metric.id} sx={{ marginTop: 2 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    {metric.question || 'Untitled question'}
                  </Typography>
                  <Typography>
                    {metric.description || 'No description'}
                  </Typography>
                </CardContent>
                <Button>EDIT</Button>
                <Button>DELETE</Button>
              </Card>
            ))}
          </Box>
        )}
      </ZUIFuture>
    </>
  );
};

CanvassAssignmentEditorPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentEditorPage;
