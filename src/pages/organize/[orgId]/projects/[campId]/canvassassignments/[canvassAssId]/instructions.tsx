import { GetServerSideProps } from 'next';
import { useContext, useState } from 'react';
import { Box, Button, Link, Paper, Typography } from '@mui/material';

import { AREAS } from 'utils/featureFlags';
import CanvassAssignmentLayout from 'features/canvassAssignments/layouts/CanvassAssignmentLayout';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useCanvassInstructions from 'features/canvassAssignments/hooks/useCanvassInstructions';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUITextEditor from 'zui/ZUITextEditor';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [AREAS],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, canvassAssId } = ctx.params!;
  return {
    props: { campId, canvassAssId, orgId },
  };
}, scaffoldOptions);

interface CanvassAssignmentInstructionsProps {
  orgId: string;
  canvassAssId: string;
}

const CanvassAssignmentInstructionsPage: PageWithLayout<
  CanvassAssignmentInstructionsProps
> = ({ orgId, canvassAssId }) => {
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  // const messages = useMessages(messageIds);

  const {
    hasNewText,
    instructions,
    isSaved,
    isSaving,
    isUnsaved,
    revert,
    save,
    setInstructions,
  } = useCanvassInstructions(parseInt(orgId), canvassAssId);
  const [key, setKey] = useState(1);

  return (
    <Box width="70%">
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(max(35ch, 100vh - 300px))',
            minHeight: 0,
            padding: 2,
          }}
        >
          <Typography variant="h4">Canvass Instructions</Typography>
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              save();
            }}
            style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 2,
                marginTop: 4,
                minHeight: 0,
              }}
            >
              <ZUITextEditor
                key={key}
                initialValue={instructions}
                onChange={(markdown) => setInstructions(markdown)}
                placeholder={'Add instructions for your canvassers'}
              />
            </Box>
            <Box alignItems="center" display="flex" justifyContent="flex-end">
              <Box marginRight={2}>
                {isSaved && (
                  <Typography>{'Everything is up to date!'}</Typography>
                )}
                {isUnsaved && (
                  <Typography component="span">
                    {'You have unsaved changes. '}
                    <Link
                      color="textPrimary"
                      component="span"
                      onClick={() => {
                        showConfirmDialog({
                          onSubmit: () => {
                            revert();
                            //Force Slate to re-mount
                            setKey((current) => current + 1);
                          },
                          warningText:
                            'Do you want to delete all unsaved changes and go back to saved instructions?',
                        });
                      }}
                      style={{ cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      {'Revert to saved version?'}
                    </Link>
                  </Typography>
                )}
              </Box>
              <Button
                color="primary"
                disabled={!hasNewText}
                type="submit"
                variant="contained"
              >
                {isSaving ? 'Saving..' : 'Save'}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

CanvassAssignmentInstructionsPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentInstructionsPage;
