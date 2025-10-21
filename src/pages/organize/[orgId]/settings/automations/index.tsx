import Link from 'next/link';
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

  const sortedAutomations = automations
    .concat()
    .sort((item0, item1) => Number(item1.active) - Number(item0.active));

  return (
    <Grid container spacing={2}>
      {sortedAutomations.map((automation) => {
        const url = `/organize/${orgId}/settings/automations/${automation.id}`;
        return (
          <Grid key={automation.id} size={{ lg: 4, md: 6, sm: 12, xl: 3 }}>
            <Link href={url}>
              <AutomationCard automation={automation} />
            </Link>
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
