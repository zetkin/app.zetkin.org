import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import ProjectsActionButtons from '../components/ProjectsActionButtons';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

interface AllProjectsLayoutProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
}

const AllProjectsLayout: FunctionComponent<AllProjectsLayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const { orgId } = useRouter().query;
  const messages = useMessages(messageIds);

  return (
    <TabbedLayout
      actionButtons={<ProjectsActionButtons />}
      baseHref={`/organize/${orgId}/projects`}
      defaultTab="/"
      fixedHeight={fixedHeight}
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
      title={messages.layout.allProjects()}
    >
      {children}
    </TabbedLayout>
  );
};

export default AllProjectsLayout;
