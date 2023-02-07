import { FormattedMessage as Msg } from 'react-intl';
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

import { MUIOnlyPersonSelect as PersonSelect } from 'zui/ZUIPersonSelect';
import useViewDataModel from '../hooks/useViewDataModel';
import ViewSmartSearchDialog from './ViewSmartSearchDialog';
import { ZetkinView } from 'features/views/components/types';

export interface EmptyViewProps {
  orgId: string | number;
  view: ZetkinView;
}

const EmptyView: FunctionComponent<EmptyViewProps> = ({ orgId, view }) => {
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);

  const model = useViewDataModel();

  return (
    <Box m={2}>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                <Msg id="misc.views.empty.static.headline" />
              </Typography>
              <Typography variant="body1">
                <Msg id="misc.views.empty.static.description" />
              </Typography>
              <Box marginTop={2}>
                <PersonSelect
                  name="person"
                  onChange={async (person) => {
                    await model.deleteContentQuery();
                    await model.addPerson(person);
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
                <Msg id="misc.views.empty.dynamic.headline" />
              </Typography>
              <Typography variant="body1">
                <Msg id="misc.views.empty.dynamic.description" />
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                data-testid="EmptyView-configureButton"
                onClick={() => setQueryDialogOpen(true)}
              >
                <Msg id="misc.views.empty.dynamic.configureButton" />
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
