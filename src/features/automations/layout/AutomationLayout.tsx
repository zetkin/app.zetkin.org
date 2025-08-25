import { FC, ReactNode } from 'react';

import SimpleLayout from 'utils/layout/SimpleLayout';
import { useNumericRouteParams } from 'core/hooks';
import useAutomation from '../hooks/useAutomation';
import AutomationStatusChip from '../components/AutomationStatusChip';
import useAutomationMutations from '../hooks/useAutomationMutations';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import SchedulingButton from '../components/SchedulingButton';

type Props = {
  children: ReactNode;
};

const AutomationLayout: FC<Props> = ({ children }) => {
  const { orgId, automationId } = useNumericRouteParams();
  const automation = useAutomation(orgId, automationId);
  const { updateAutomation } = useAutomationMutations(orgId, automationId);

  return (
    <SimpleLayout
      actionButtons={<SchedulingButton automation={automation} />}
      subtitle={<AutomationStatusChip automation={automation} />}
      title={
        <ZUIEditTextinPlace
          onChange={(title) => updateAutomation({ title })}
          value={automation.title}
        />
      }
    >
      {children}
    </SimpleLayout>
  );
};

export default AutomationLayout;
