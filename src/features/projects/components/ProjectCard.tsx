import NextLink from 'next/link';
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinProject } from 'utils/types/zetkin';
import ProjectStatusChip from './ProjectStatusChip';

interface ProjectCardProps {
  project: ZetkinProject;
}

const ProjectCard = ({ project }: ProjectCardProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const { id, title } = project;

  return (
    <Card data-testid="project-card">
      <CardActionArea
        aria-label={messages.all.cardAriaLabel({ title })}
        component={NextLink}
        href={`/organize/${orgId}/projects/${id}`}
      >
        <CardContent>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              gap: 1,
              justifyContent: 'space-between',
            }}
          >
            <Typography gutterBottom noWrap variant="h6">
              {title}
            </Typography>
            <ProjectStatusChip project={project} />
          </Box>
        </CardContent>
        <CardActions sx={{ paddingBottom: 2, paddingLeft: 2 }}>
          <Typography
            color="primary"
            sx={{
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            variant="button"
          >
            <Msg id={messageIds.all.cardCTA} />
          </Typography>
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

export default ProjectCard;
