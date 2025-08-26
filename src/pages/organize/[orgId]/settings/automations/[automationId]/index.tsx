import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useServerSide from 'core/useServerSide';
import useAutomation from 'features/automations/hooks/useAutomation';
import AutomationLayout from 'features/automations/layout/AutomationLayout';
import AutomationTargetConfig from 'features/automations/components/AutomationTargetConfig';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { automationId, orgId } = ctx.params!;
    return {
      props: {
        automationId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
  }
);

const AutomationPage: PageWithLayout<{
  automationId: number;
  orgId: number;
}> = ({ automationId, orgId }) => {
  const onServer = useServerSide();
  const automation = useAutomation(orgId, automationId);

  if (onServer) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      <AutomationTargetConfig automation={automation} />
    </Grid>
  );
};

AutomationPage.getLayout = function getLayout(page) {
  return <AutomationLayout>{page}</AutomationLayout>;
};

export default AutomationPage;
