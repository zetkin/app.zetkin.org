import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { FunctionComponent, useState } from 'react';

import { Msg } from 'core/i18n';
import { MUIOnlyPersonSelect as PersonSelect } from 'zui/ZUIPersonSelect';
import ViewSmartSearchDialog from './ViewSmartSearchDialog';
import { ZetkinView } from 'features/views/components/types';

import messageIds from '../l10n/messageIds';
import UseViewDataTableMutation from '../hooks/useViewDataTableMutation';

export interface EmptyViewProps {
  orgId: string | number;
  view: ZetkinView;
}

const EmptyView: FunctionComponent<EmptyViewProps> = ({ orgId, view }) => {
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);

  const { addPerson, deleteContentQuery } = UseViewDataTableMutation(
    parseInt(orgId as string),
    view.id
  );

  return (
    <Box m={2}>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                <Msg id={messageIds.empty.static.headline} />
              </Typography>
              <Typography variant="body1">
                <Msg id={messageIds.empty.static.description} />
              </Typography>
              <Box marginTop={2}>
                <PersonSelect
                  name="person"
                  onChange={async (person) => {
                    await deleteContentQuery();
                    await addPerson(person.id);
                  }}
                  selectedPerson={null}
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                <Msg id={messageIds.empty.dynamic.headline} />
              </Typography>
              <Typography variant="body1">
                <Msg id={messageIds.empty.dynamic.description} />
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                data-testid="EmptyView-configureButton"
                onClick={() => setQueryDialogOpen(true)}
              >
                <Msg id={messageIds.empty.dynamic.configureButton} />
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      {queryDialogOpen && (
        <ViewSmartSearchDialog
          onDialogClose={() => setQueryDialogOpen(false)}
          orgId={orgId}
          view={view}
        />
      )}
    </Box>
  );
};

export default EmptyView;
