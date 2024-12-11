'use client';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { FC } from 'react';

import useMyCanvassAssignments from 'features/canvassAssignments/hooks/useMyCanvassAssignments';
import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';

const HomePage: FC = () => {
  const canvassAssignments = useMyCanvassAssignments();
  const callAssignments = useMyCallAssignments();

  const allAssignments = [...canvassAssignments, ...callAssignments];

  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {allAssignments.map((assignment) => {
        return (
          <Card key={assignment.id}>
            <CardContent>
              <Typography variant="h6">
                {assignment.title || 'Untitled assignment'}
              </Typography>
            </CardContent>
            <CardActions>
              {'cooldown' in assignment && (
                <Button
                  href={`/call/${assignment.id}`}
                  LinkComponent={Link}
                  variant="outlined"
                >
                  Start calling
                </Button>
              )}
              {'areas' in assignment && (
                <Button
                  href={`/canvass/${assignment.id}`}
                  LinkComponent={Link}
                  variant="outlined"
                >
                  Go to map
                </Button>
              )}
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
};

export default HomePage;
