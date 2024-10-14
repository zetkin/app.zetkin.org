import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';

import { AREAS } from 'utils/featureFlags';
import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useCanvassAssignmentMutations from 'features/areas/hooks/useCanvassAssignmentMutations';
import useCanvassAssignment from 'features/areas/hooks/useCanvassAssignment';
import ZUIFuture from 'zui/ZUIFuture';
import { ZetkinMetric } from 'features/areas/types';
import MetricCard from 'features/areas/components/Metrics/MetricCard';

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

const CanvassAssignmentEditorPage: PageWithLayout<
  CanvassAssignmentEditorProps
> = ({ orgId, canvassAssId }) => {
  const updateCanvassAssignment = useCanvassAssignmentMutations(
    parseInt(orgId),
    canvassAssId
  );
  const canvassFuture = useCanvassAssignment(parseInt(orgId), canvassAssId);

  const [editingMetric, setEditingMetric] = useState<ZetkinMetric | null>(null);

  const handleSaveMetric = async (metric: ZetkinMetric) => {
    if (canvassFuture.data) {
      await updateCanvassAssignment({
        metrics: canvassFuture.data.metrics
          .map((m) => (m.id === metric.id ? metric : m))
          .concat(metric.id ? [] : [metric]),
      });
    }
    setEditingMetric(null);
  };

  const handleDeleteMetric = async (id: string) => {
    if (canvassFuture.data) {
      await updateCanvassAssignment({
        metrics: canvassFuture.data.metrics.filter((m) => m.id !== id),
      });
    }
    setEditingMetric(null);
  };

  const handleAddNewMetric = (kind: 'boolean' | 'scale5') => {
    setEditingMetric({
      definesDone: false,
      description: '',
      id: '',
      kind: kind,
      question: '',
    });
  };

  return (
    <ZUIFuture future={canvassFuture}>
      {(data) => (
        <>
          <Typography>
            Here you can configure the questions for your canvass assignment
          </Typography>
          <Box alignItems="center" display="flex" mt={2}>
            <Button
              onClick={() => handleAddNewMetric('boolean')}
              sx={{ marginRight: 1 }}
              variant="contained"
            >
              Add new question yes/no type
            </Button>
            <Button
              onClick={() => handleAddNewMetric('scale5')}
              variant="contained"
            >
              Add new question scale type
            </Button>
          </Box>

          {editingMetric && (
            <MetricCard
              metric={editingMetric}
              onDelete={() => handleDeleteMetric(editingMetric.id)}
              onSave={handleSaveMetric}
            />
          )}

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
                <Box ml={1}>
                  <Button onClick={() => setEditingMetric(metric)}>EDIT</Button>
                  <Button onClick={() => handleDeleteMetric(metric.id)}>
                    DELETE
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        </>
      )}
    </ZUIFuture>
  );
};

CanvassAssignmentEditorPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentEditorPage;
