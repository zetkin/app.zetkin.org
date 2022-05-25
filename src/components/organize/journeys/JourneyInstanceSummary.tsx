import { useRouter } from 'next/router';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { Edit, Save } from '@material-ui/icons';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useContext, useEffect, useRef, useState } from 'react';

import { journeyInstanceResource } from 'api/journeys';
import SnackbarContext from 'hooks/SnackbarContext';
import ZetkinAutoTextArea from 'components/ZetkinAutoTextArea';
import { ZetkinJourneyInstance } from 'types/zetkin';
import ZetkinSection from 'components/ZetkinSection';

const useStyles = makeStyles(() => ({
  collapsed: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
    { journeyTitle: journeyInstance.journey.title.toLowerCase() }
  );

  const journeyInstanceHooks = journeyInstanceResource(
    orgId as string,
    journeyInstance.id.toString()
  );
  const patchJourneyInstanceMutation = journeyInstanceHooks.useUpdate();

  useEffect(() => {
    if (editingRef.current) {
      editingRef.current.focus();
    }
  }, [editingSummary]);

  const saveEditedSummary = (summary: string) => {
    patchJourneyInstanceMutation.mutateAsync(
      { summary },
      {
        onError: () => showSnackbar('error'),
        onSuccess: () => setEditingSummary(false),
      }
    );
  };

  const submitChange = () => {
    setEditingSummary(false);
    saveEditedSummary(summary);
  };

  return (
    <ZetkinSection
      action={
        <Button
          color="primary"
          data-testid="JourneyInstanceSummary-saveEditButton"
          onClick={
            editingSummary ? submitChange : () => setEditingSummary(true)
          }
          startIcon={editingSummary ? <Save /> : <Edit />}
          style={{ textTransform: 'uppercase' }}
        >
          <Msg
            id={
              editingSummary
                ? 'pages.organizeJourneyInstance.saveButton'
                : 'pages.organizeJourneyInstance.editButton'
            }
          />
        </Button>
      }
      title={intl.formatMessage({
        id: 'pages.organizeJourneyInstance.sections.summary',
      })}
    >
      {editingSummary ? (
        <ZetkinAutoTextArea
          ref={editingRef}
          data-testid="JourneyInstanceSummary-textArea"
          onChange={(value) => setSummary(value)}
          placeholder={summaryPlaceholder}
          value={summary}
        />
      ) : (
        <>
          {journeyInstance.summary.length > 0 ? (
            <Typography
              className={summaryCollapsed ? classes.collapsed : ''}
              style={{
                padding: '1rem 0 1rem 0',
              }}
              variant="body1"
            >
              {journeyInstance.summary}
            </Typography>
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
