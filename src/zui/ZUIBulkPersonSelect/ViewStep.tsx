import { Box, Button, Divider, Typography } from '@mui/material';
import { FC } from 'react';

import useView from 'features/views/hooks/useView';
import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';
import useViewGrid from 'features/views/hooks/useViewGrid';
import ZUIFutures from 'zui/ZUIFutures';

type Props = {
  onBack: () => void;
  onSubmit: (ids: number[]) => void;
  orgId: number;
  viewId: number;
};

const ViewStep: FC<Props> = ({ onBack, onSubmit, orgId, viewId }) => {
  const viewFuture = useView(orgId, viewId);
  const { rowsFuture } = useViewGrid(orgId, viewId);

  return (
    <Box>
      <ZUIFutures futures={{ rows: rowsFuture, view: viewFuture }}>
        {({ data: { rows, view } }) => {
          return (
            <>
              <Typography>{view.title}</Typography>
              <Typography variant="body2">{rows.length}</Typography>
              <Box>
                <Divider />
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    mt: 2,
                  }}
                >
                  <Box>
                    <Button
                      onClick={() => {
                        onBack();
                      }}
                      sx={{ mr: 2 }}
                      variant="text"
                    >
                      <Msg id={messageIds.personSelect.bulkAdd.backButton} />
                    </Button>
                    <Button
                      onClick={() => {
                        onSubmit(rows.map((row) => row.id));
                      }}
                      sx={{ mr: 2 }}
                      variant="contained"
                    >
                      <Msg id={messageIds.personSelect.bulkAdd.submitButton} />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </>
          );
        }}
      </ZUIFutures>
    </Box>
  );
};

export default ViewStep;
