import { Edit } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { Button, Typography } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useContext, useEffect, useRef, useState } from 'react';

import { journeyInstanceResource } from 'api/journeys';
import Markdown from 'components/Markdown';
import SnackbarContext from 'hooks/SnackbarContext';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import ZetkinAutoTextArea from 'components/ZetkinAutoTextArea';
import ZetkinCollapse from 'components/ZetkinCollapse';
import { ZetkinJourneyInstance } from 'types/zetkin';
import ZetkinSection from 'components/ZetkinSection';

const JourneyInstanceSummary = ({
  journeyInstance,
}: {
  journeyInstance: ZetkinJourneyInstance;
}): JSX.Element => {
  const { orgId } = useRouter().query;
  const intl = useIntl();
  const { showSnackbar } = useContext(SnackbarContext);

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
    <ZetkinSection
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
          <ZetkinAutoTextArea
            ref={editingRef}
            data-testid="JourneyInstanceSummary-textArea"
            onChange={(value) => setSummary(value)}
            placeholder={summaryPlaceholder}
            value={summary}
          />
          <SubmitCancelButtons
            onCancel={cancelEditingSummary}
            submitDisabled={patchJourneyInstanceMutation.isLoading}
          />
        </form>
      ) : (
        // Not editing
        <>
          {journeyInstance.summary.length > 0 ? (
            <ZetkinCollapse collapsedSize={90}>
              <Markdown
                BoxProps={{
                  fontSize: '1rem',
                }}
                markdown={journeyInstance.summary}
              />
            </ZetkinCollapse>
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
    </ZetkinSection>
  );
};

export default JourneyInstanceSummary;
