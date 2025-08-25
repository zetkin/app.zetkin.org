import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useServerSide from 'core/useServerSide';
import AutomationListLayout from 'features/automations/layout/AutomationListLayout';
import useAutomations from 'features/automations/hooks/useAutomations';
import AutomationCard from 'features/automations/components/AutomationCard';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId } = ctx.params!;
    return {
      props: {
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
  }
);

const AutomationListPage: PageWithLayout<{ orgId: number }> = ({ orgId }) => {
  const onServer = useServerSide();
  const automations = useAutomations(orgId);

  if (onServer) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      {automations.map((automation) => {
        return (
          <Grid key={automation.id} size={{ lg: 4, md: 6, sm: 12, xl: 3 }}>
            <AutomationCard automation={automation} />
          </Grid>
        );
      })}
    </Grid>
  );
};

AutomationListPage.getLayout = function getLayout(page) {
  return <AutomationListLayout>{page}</AutomationListLayout>;
};

export default AutomationListPage;
