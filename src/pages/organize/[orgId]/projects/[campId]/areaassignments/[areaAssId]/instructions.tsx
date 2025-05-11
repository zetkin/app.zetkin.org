import { GetServerSideProps } from 'next';
import { useContext, useState } from 'react';
import { Box, Button, Link, Paper, Typography } from '@mui/material';
import Head from 'next/head';

import { AREAS } from 'utils/featureFlags';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUITextEditor from 'zui/ZUITextEditor';
import AreaAssignmentLayout from 'features/areaAssignments/layouts/AreaAssignmentLayout';
import useAreaAssignmentInstructions from 'features/areaAssignments/hooks/useCanvassInstructions';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/areaAssignments/l10n/messageIds';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [AREAS],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, areaAssId } = ctx.params!;
  return {
    props: { areaAssId, campId, orgId },
  };
}, scaffoldOptions);

interface AreaAssignmentInstructionsProps {
  orgId: string;
  areaAssId: string;
}

const AreaAssignmentInstructionsPage: PageWithLayout<
  AreaAssignmentInstructionsProps
> = ({ orgId, areaAssId }) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const areaAssignmentFuture = useAreaAssignment(parseInt(orgId), areaAssId);

  const {
    hasNewText,
    instructions,
    isSaved,
    isSaving,
    isUnsaved,
    revert,
    save,
    setInstructions,
  } = useAreaAssignmentInstructions(parseInt(orgId), areaAssId);
  const [key, setKey] = useState(1);

  return (
    <>
      <Head>
        <title>{areaAssignmentFuture.data?.title}</title>
      </Head>
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
            <Typography variant="h4">
              <Msg id={messageIds.instructions.title} />
            </Typography>
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
                  placeholder={messages.instructions.editor.editorPlaceholder()}
                />
              </Box>
              <Box alignItems="center" display="flex" justifyContent="flex-end">
                <Box marginRight={2}>
                  {isSaved && (
                    <Typography>
                      <Msg id={messageIds.instructions.editor.savedMessage} />
                    </Typography>
                  )}
                  {isUnsaved && (
                    <Typography component="span">
                      <Msg id={messageIds.instructions.editor.unsavedMessage} />
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
                            warningText: messages.instructions.editor.confirm(),
                          });
                        }}
                        style={{ cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <Msg id={messageIds.instructions.editor.revertLink} />
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
                  <Msg
                    id={
                      isSaving
                        ? messageIds.instructions.editor.savingButton
                        : messageIds.instructions.editor.saveButton
                    }
                  />
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

AreaAssignmentInstructionsPage.getLayout = function getLayout(page) {
  return <AreaAssignmentLayout {...page.props}>{page}</AreaAssignmentLayout>;
};

export default AreaAssignmentInstructionsPage;
