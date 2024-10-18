import { FC, ReactNode } from 'react';
import { useRouter } from 'next/router';

import TabbedLayout from 'utils/layout/TabbedLayout';
import useCanvassAssignment from '../hooks/useCanvassAssignment';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import useCanvassAssignmentMutations from '../hooks/useCanvassAssignmentMutations';

type CanvassAssignmentLayoutProps = {
  campId: number;
  canvassAssId: string;
  children: ReactNode;
  orgId: number;
};

const CanvassAssignmentLayout: FC<CanvassAssignmentLayoutProps> = ({
  children,
  orgId,
  campId,
  canvassAssId,
}) => {
  const path = useRouter().pathname;
  const canvassAssignment = useCanvassAssignment(orgId, canvassAssId).data;
  const updateCanvassAssignment = useCanvassAssignmentMutations(
    orgId,
    canvassAssId
  );

  const isPlanTab = path.endsWith('/plan');

  if (!canvassAssignment) {
    return null;
  }

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/projects/${campId}/canvassassignments/${canvassAssId}`}
      defaultTab="/"
      fixedHeight={isPlanTab}
      tabs={[
        { href: '/', label: 'Overview' },
        { href: '/plan', label: 'Plan' },
        { href: '/canvassers', label: 'Canvassers' },
        { href: '/editor', label: 'Editor' },
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) => updateCanvassAssignment({ title: newTitle })}
          value={canvassAssignment.title || 'Untitled canvass assignment'}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default CanvassAssignmentLayout;
