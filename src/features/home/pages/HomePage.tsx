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

const HomePage: FC = () => {
  const canvassAssignments = useMyCanvassAssignments();

  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {canvassAssignments.map((assignment) => {
        return (
          <Card key={assignment.id}>
            <CardContent>
              <Typography variant="h6">
                {assignment.title || 'Untitled assignment'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                href={`/canvass/${assignment.id}`}
                LinkComponent={Link}
                variant="outlined"
              >
                Go to map
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
};

export default HomePage;
