import { FormattedDate } from 'react-intl';
import { FunctionComponent } from 'react';
import { Box } from '@mui/material';

import ProjectsActionButtons from 'features/projects/components/ProjectsActionButtons';
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
  const { orgId, projectId } = useNumericRouteParams();
  const { projectFuture: projectFuture } = useProject(orgId, projectId);
  const { firstEvent, lastEvent } = useProjectEvents(orgId, projectId);

  const project = projectFuture.data;

  if (!project) {
    return null;
  }

  return (
    <TabbedLayout
      actionButtons={<ProjectsActionButtons />}
      baseHref={`/organize/${orgId}/projects/${projectId}`}
      defaultTab="/"
      fixedHeight={fixedHeight}
      subtitle={
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <ProjectStatusChip project={project} />
          <Box>
            {firstEvent && lastEvent ? (
              <>
                <FormattedDate
                  day="2-digit"
                  month="long"
                  value={removeOffset(firstEvent.start_time)}
                />
                {` - `}
                <FormattedDate
                  day="2-digit"
                  month="long"
                  value={removeOffset(lastEvent.end_time)}
                  year="numeric"
                />
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
