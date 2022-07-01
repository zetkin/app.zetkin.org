import { Edit } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useContext, useEffect, useRef, useState } from 'react';

import { journeyInstanceResource } from 'api/journeys';
import Markdown from 'components/Markdown';
import SnackbarContext from 'hooks/SnackbarContext';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import ZetkinAutoTextArea from 'components/ZetkinAutoTextArea';
import { ZetkinJourneyInstance } from 'types/zetkin';
import ZetkinSection from 'components/ZetkinSection';

const useStyles = makeStyles(() => ({
  collapsed: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const JourneyInstanceSummary = ({
  journeyInstance,
}: {
  journeyInstance: ZetkinJourneyInstance;
}): JSX.Element => {
  const classes = useStyles();
  const { orgId } = useRouter().query;
  const intl = useIntl();
  const { showSnackbar } = useContext(SnackbarContext);

  const editingRef = useRef<HTMLTextAreaElement>(null);

  const [summaryCollapsed, setSummaryCollapsed] = useState<boolean>(true);

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
            <Markdown
              BoxProps={{
                className: summaryCollapsed ? classes.collapsed : '',
                onClick: () => setSummaryCollapsed(true),
                style: {
                  overflowWrap: 'break-word',
                  padding: '0.75rem 0',
                },
              }}
              markdown={journeyInstance.summary}
            />
          ) : (
            <Typography
              className={summaryCollapsed ? classes.collapsed : ''}
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
          {journeyInstance.summary.length > 100 && (
            <Button
              color="primary"
              onClick={() => setSummaryCollapsed((prev) => !prev)}
              startIcon={summaryCollapsed ? <ExpandMore /> : <ExpandLess />}
              style={{ textTransform: 'uppercase' }}
            >
              <Msg
                id={
                  summaryCollapsed
                    ? 'pages.organizeJourneyInstance.expandButton'
                    : 'pages.organizeJourneyInstance.collapseButton'
                }
              />
            </Button>
          )}
        </>
      )}
    </ZetkinSection>
  );
};

export default JourneyInstanceSummary;
