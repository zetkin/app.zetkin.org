import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { GetServerSideProps } from 'next';

import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';
import useAreas from 'features/areas/hooks/useAreas';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIDialog from 'zui/ZUIDialog';
import useCreateCanvassSession from 'features/areas/hooks/useCreateCanvassSession';
import useCanvassSessions from 'features/areas/hooks/useCanvassSessions';

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
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  const areasFuture = useAreas(parseInt(orgId));
  const createCanvassSession = useCreateCanvassSession(
    parseInt(orgId),
    canvassAssId
  );
  const allSessions =
    useCanvassSessions(parseInt(orgId), canvassAssId).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === canvassAssId
  );

  return (
    <Box>
      <Button onClick={() => setAdding(true)}>Add</Button>
      {sessions.map((session, index) => {
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
