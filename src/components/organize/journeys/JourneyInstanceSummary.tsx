import { useRouter } from 'next/router';
import {
  Button,
  lighten,
  makeStyles,
  TextareaAutosize,
  Typography,
} from '@material-ui/core';
import { Edit, Save } from '@material-ui/icons';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useEffect, useRef, useState } from 'react';

import { journeyInstanceResource } from 'api/journeys';
import { ZetkinJourneyInstance } from 'types/zetkin';
import ZetkinSection from 'components/ZetkinSection';

const useStyles = makeStyles((theme) => ({
  collapsed: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  editSummary: {
    border: '2px dotted transparent',
    borderColor: lighten(theme.palette.primary.main, 0.65),
    borderRadius: 10,
    fontFamily: theme.typography.fontFamily,
    lineHeight: '1.5',
    overflow: 'hidden',
    padding: 10,
    resize: 'none',
    width: '100%',
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

  const editingRef = useRef<HTMLTextAreaElement>(null);

  const [summaryCollapsed, setSummaryCollapsed] = useState<boolean>(true);

  const [editingSummary, setEditingSummary] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>(journeyInstance.summary);

  const journeyInstanceHooks = journeyInstanceResource(
    orgId as string,
    journeyInstance.journey.id.toString(),
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
        id: 'pages.organizeJourneyInstance.summaryHeader',
      })}
    >
      {editingSummary ? (
        <TextareaAutosize
          ref={editingRef}
          className={classes.editSummary}
          onChange={(e) => setSummary(e.target.value)}
          value={summary}
        />
      ) : (
        <>
          <Typography
            className={summaryCollapsed ? classes.collapsed : ''}
            style={{
              padding: '1rem 0 1rem 0',
            }}
            variant="body1"
          >
            {journeyInstance.summary}
          </Typography>
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
