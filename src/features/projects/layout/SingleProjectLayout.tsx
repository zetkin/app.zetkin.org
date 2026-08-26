import { useFormatter } from 'next-intl';
import { FunctionComponent } from 'react';
import { Box } from '@mui/material';

import ProjectActionButtons from 'features/projects/components/ProjectActionButtons';
import EditableProjectTitle from '../components/EditableProjectTitle';
import messageIds from '../l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useProject from '../hooks/useProject';
import useProjectEvents from '../hooks/useProjectEvents';
import { useNumericRouteParams } from 'core/hooks';
import { Msg, useMessages } from 'core/i18n';
import ProjectStatusChip from '../components/ProjectStatusChip';

interface SingleProjectLayoutProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
}

const SingleProjectLayout: FunctionComponent<SingleProjectLayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const messages = useMessages(messageIds);
  const format = useFormatter();
  const { orgId, projectId } = useNumericRouteParams();
  const { projectFuture: projectFuture } = useProject(orgId, projectId);
  const { firstEvent, lastEvent } = useProjectEvents(orgId, projectId);

  const project = projectFuture.data;

  if (!project) {
    return null;
  }

  return (
    <TabbedLayout
      actionButtons={<ProjectActionButtons project={project} />}
      baseHref={`/organize/${orgId}/projects/${projectId}`}
      defaultTab="/"
      fixedHeight={fixedHeight}
      subtitle={
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <ProjectStatusChip project={project} />
          <Box>
            {firstEvent && lastEvent ? (
              <>
                {format.dateTime(
                  new Date(removeOffset(firstEvent.start_time)),
                  {
                    day: '2-digit',
                    month: 'long',
                  }
                )}
                {` - `}
                {format.dateTime(new Date(removeOffset(lastEvent.end_time)), {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </>
            ) : (
              <Msg id={messageIds.indefinite} />
            )}
          </Box>
        </Box>
      }
      tabs={[
        { href: `/`, label: messages.layout.overview() },
        {
          href: `/calendar`,
          label: messages.layout.calendar(),
        },
        {
          href: '/activities',
          label: messages.layout.activities(),
        },
        {
          href: '/archive',
          label: messages.layout.archive(),
        },
      ]}
      title={<EditableProjectTitle project={project} />}
    >
      {children}
    </TabbedLayout>
  );
};

export default SingleProjectLayout;
