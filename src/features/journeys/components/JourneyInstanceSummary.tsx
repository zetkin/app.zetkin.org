import { Edit } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Button, Typography } from '@mui/material';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useContext, useEffect, useRef, useState } from 'react';

import { journeyInstanceResource } from 'features/journeys/api/journeys';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import ZUIAutoTextArea from 'zui/ZUIAutoTextArea';
import ZUICollapse from 'zui/ZUICollapse';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import ZUISection from 'zui/ZUISection';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';

const JourneyInstanceSummary = ({
  journeyInstance,
}: {
  journeyInstance: ZetkinJourneyInstance;
}): JSX.Element => {
  const { orgId } = useRouter().query;
  const intl = useIntl();
  const { showSnackbar } = useContext(ZUISnackbarContext);

  const editingRef = useRef<HTMLTextAreaElement>(null);

  const [editingSummary, setEditingSummary] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>(journeyInstance.summary);
  const summaryPlaceholder = intl.formatMessage(
    {
      id: 'pages.organizeJourneyInstance.summaryPlaceholder',
    },
    { journeyTitle: journeyInstance.journey.singular_label.toLowerCase() }
  );

  const patchJourneyInstanceMutation = journeyInstanceResource(
    orgId as string,
    journeyInstance.id.toString()
  ).useUpdate();

  useEffect(() => {
    if (editingRef.current) {
      editingRef.current.focus();
    }
  }, [editingSummary]);

  const saveEditedSummary = async () => {
    return await patchJourneyInstanceMutation.mutateAsync(
      { summary },
      {
        onError: () => showSnackbar('error'),
        onSuccess: () => setEditingSummary(false),
      }
    );
  };

  const cancelEditingSummary = () => {
    setEditingSummary(false);
    setSummary(journeyInstance.summary);
  };

  return (
    <ZUISection
      action={
        editingSummary ? null : (
          <Button
            color="primary"
            data-testid="JourneyInstanceSummary-editButton"
            onClick={() => setEditingSummary(true)}
            startIcon={<Edit />}
            style={{ textTransform: 'uppercase' }}
          >
            <Msg id={'pages.organizeJourneyInstance.editButton'} />
          </Button>
        )
      }
      title={intl.formatMessage({
        id: 'pages.organizeJourneyInstance.sections.summary',
      })}
    >
      {editingSummary ? (
        // Editing
        <form
          onSubmit={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const patchedInstance = await saveEditedSummary();
            setEditingSummary(false);
            setSummary(patchedInstance.summary);
          }}
        >
          <ZUIAutoTextArea
            ref={editingRef}
            data-testid="JourneyInstanceSummary-textArea"
            onChange={(value) => setSummary(value)}
            placeholder={summaryPlaceholder}
            value={summary}
          />
          <ZUISubmitCancelButtons
            onCancel={cancelEditingSummary}
            submitDisabled={patchJourneyInstanceMutation.isLoading}
          />
        </form>
      ) : (
        // Not editing
        <>
          {journeyInstance.summary.length > 0 ? (
            <ZUICollapse collapsedSize={90}>
              <ZUIMarkdown
                BoxProps={{
                  fontSize: '1rem',
                  style: {
                    overflowWrap: 'anywhere',
                  },
                }}
                markdown={journeyInstance.summary}
              />
            </ZUICollapse>
          ) : (
            <Typography
              color="secondary"
              onClick={() => setEditingSummary(true)}
              style={{
                cursor: 'pointer',
                padding: '1rem 0 1rem 0',
              }}
              variant="body1"
            >
              {summaryPlaceholder}
            </Typography>
          )}
        </>
      )}
    </ZUISection>
  );
};

export default JourneyInstanceSummary;
