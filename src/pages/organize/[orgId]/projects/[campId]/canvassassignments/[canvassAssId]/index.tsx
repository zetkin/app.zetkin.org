import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';

import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';
import { ZetkinCanvassSession } from 'features/areas/types';
import useAreas from 'features/areas/hooks/useAreas';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIDialog from 'zui/ZUIDialog';
import useCreateCanvassSession from 'features/areas/hooks/useCreateCanvassSession';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, canvassAssId } = ctx.params!;
  return {
    props: { campId, canvassAssId, orgId },
  };
}, scaffoldOptions);

interface CanvassAssignmentPageProps {
  orgId: string;
  canvassAssId: string;
}

const CanvassAssignmentPage: PageWithLayout<CanvassAssignmentPageProps> = ({
  orgId,
  canvassAssId,
}) => {
  const [sessions, setSessions] = useState<ZetkinCanvassSession[] | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const areasFuture = useAreas(parseInt(orgId));
  const [adding, setAdding] = useState(false);

  const createCanvassSession = useCreateCanvassSession(
    parseInt(orgId),
    canvassAssId
  );

  async function loadSessions() {
    const res = await fetch(
      `/beta/orgs/${orgId}/canvassassignments/${canvassAssId}/sessions`
    );
    const payload = await res.json();
    setSessions(payload.data as ZetkinCanvassSession[]);
  }

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <Box>
      <Button onClick={() => setAdding(true)}>Add</Button>
      {sessions?.map((session, index) => {
        return (
          <Box key={index}>
            <Box>{session.assignee.first_name}</Box>
            <Box>{session.area.title || session.area.id}</Box>
          </Box>
        );
      })}
      <ZUIDialog onClose={() => setAdding(false)} open={adding}>
        <ZUIFuture future={areasFuture}>
          {(areas) => (
            <>
              <Box height={100} width={300}>
                <ZUIPersonSelect
                  onChange={(person) => {
                    setSelectedPersonId(person.id);
                  }}
                  selectedPerson={null}
                />
              </Box>
              <Box>
                <select
                  onChange={(evt) => {
                    setSelectedAreaId(evt.target.value);
                  }}
                >
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.title || area.id}
                    </option>
                  ))}
                </select>
              </Box>
              <Button
                onClick={async () => {
                  if (selectedAreaId && selectedPersonId) {
                    createCanvassSession({
                      areaId: selectedAreaId,
                      personId: selectedPersonId,
                    });

                    loadSessions();
                    setAdding(false);
                  }
                }}
              >
                Save
              </Button>
            </>
          )}
        </ZUIFuture>
      </ZUIDialog>
    </Box>
  );
};

CanvassAssignmentPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentPage;
