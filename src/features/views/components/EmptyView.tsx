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
import UseViewDataTableMutations from '../hooks/useViewDataTableMutations';
import ViewSmartSearchDialog from './ViewSmartSearchDialog';
import { ZetkinView } from 'features/views/components/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import zuiMessageIds from 'zui/l10n/messageIds';
import { ZetkinSmartSearchFilter } from 'utils/types/zetkin';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';

export interface EmptyViewProps {
  orgId: number;
  view: ZetkinView;
}

const EmptyView: FunctionComponent<EmptyViewProps> = ({ orgId, view }) => {
  const [queryDialogOpen, setQueryDialogOpen] = useState<{
    initialSmartSearchFilter?: ZetkinSmartSearchFilter[];
    open: boolean;
  }>({ initialSmartSearchFilter: undefined, open: false });
  const messages = useMessages(zuiMessageIds);

  const { addPerson, deleteContentQuery } = UseViewDataTableMutations(
    orgId,
    view.id
  );

  return (
    <Box
      alignItems="stretch"
      gap={2}
      m={2}
      margin="auto"
      maxWidth={500}
      sx={{
        display: 'grid',
      }}
    >
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h5">
            <Msg id={messageIds.empty.newPeople.headline} />
          </Typography>
          <Typography variant="body1">
            <Msg id={messageIds.empty.newPeople.description} />
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            data-testid="EmptyView-configureButton"
            onClick={() =>
              setQueryDialogOpen({
                initialSmartSearchFilter: [
                  {
                    config: {
                      after: '-30d',
                      field: 'extra_date',
                    },
                    op: OPERATION.ADD,
                    type: FILTER_TYPE.PERSON_FIELD,
                  },
                ],
                open: true,
              })
            }
          >
            <Msg id={messageIds.empty.newPeople.configureButton} />
          </Button>
        </CardActions>
      </Card>
      <Card sx={{ width: '100%' }}>
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
            onClick={() =>
              setQueryDialogOpen({
                initialSmartSearchFilter: undefined,
                open: true,
              })
            }
          >
            <Msg id={messageIds.empty.dynamic.configureButton} />
          </Button>
        </CardActions>
      </Card>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h5">
            <Msg id={messageIds.empty.static.headline} />
          </Typography>
          <Typography variant="body1">
            <Msg id={messageIds.empty.static.description} />
          </Typography>
          <Box marginTop={2}>
            <PersonSelect
              createPersonLabels={{
                submitLabel: messages.createPerson.submitLabel.add(),
                title: messages.createPerson.title.addToList({
                  list: view.title,
                }),
              }}
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
      {queryDialogOpen.open && (
        <ViewSmartSearchDialog
          initialSmartSearchFilter={queryDialogOpen.initialSmartSearchFilter}
          onDialogClose={() => setQueryDialogOpen({ open: false })}
          orgId={orgId}
          view={view}
        />
      )}
    </Box>
  );
};

export default EmptyView;
