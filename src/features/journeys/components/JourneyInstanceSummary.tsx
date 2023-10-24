import { Edit } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import ZUIAutoTextArea from 'zui/ZUIAutoTextArea';
import ZUICollapse from 'zui/ZUICollapse';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import ZUISection from 'zui/ZUISection';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';
import useJourneyInstanceMutations from '../hooks/useJourneyInstanceMutations';
import { useNumericRouteParams } from 'core/hooks';

const JourneyInstanceSummary = ({
  journeyInstance,
}: {
  journeyInstance: ZetkinJourneyInstance;
}): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const editingRef = useRef<HTMLTextAreaElement>(null);

  const [editingSummary, setEditingSummary] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>(journeyInstance.summary);
  const summaryPlaceholder = messages.instance.summaryPlaceholder({
    journeyTitle: journeyInstance.journey.singular_label.toLowerCase(),
  });

  const { updateJourneyInstance } = useJourneyInstanceMutations(
    orgId,
    journeyInstance.id
  );

  useEffect(() => {
    if (editingRef.current) {
      editingRef.current.focus();
    }
  }, [editingSummary]);

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
            <Msg id={messageIds.instance.editButton} />
          </Button>
        )
      }
      title={messages.instance.sections.summary()}
    >
      {editingSummary ? (
        // Editing
        <form
          onSubmit={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const patchedInstance = await updateJourneyInstance({ summary });
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
          <ZUISubmitCancelButtons onCancel={cancelEditingSummary} />
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
