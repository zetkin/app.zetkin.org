import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Box, Chip, Grid, Typography, useTheme } from '@mui/material';

import BackendApiClient from 'core/api/client/BackendApiClient';
import DefaultLayout from 'utils/layout/DefaultLayout';
import Header from 'zui/ZUIHeader';
import JourneyInstanceSidebar from 'features/journeys/components/JourneyInstanceSidebar';
import messageIds from 'features/journeys/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { personResource } from 'features/profile/api/people';
import { scaffold } from 'utils/next';
import useCreateJourneyInstance from 'features/journeys/hooks/useCreateJourneyInstance';
import useJourney from 'features/journeys/hooks/useJourney';
import { useRouter } from 'next/router';
import ZUIAutoTextArea from 'zui/ZUIAutoTextArea';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinPerson, ZetkinTag } from 'utils/types/zetkin';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'misc',
    'pages.organizeJourneyInstance',
    'pages.organizeNewJourneyInstance',
  ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, journeyId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);
  const journey = await apiClient.get(
    `/api/orgs/${orgId}/journeys/${journeyId}`
  );
  const organization = await apiClient.get(`/api/orgs/${orgId}`);

  if (organization && journey) {
    return {
      props: {
        journeyId,
        orgId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

interface NewJourneyPageProps {
  journeyId: string;
  orgId: string;
}

const NewJourneyPage: PageWithLayout<NewJourneyPageProps> = ({
  journeyId,
  orgId,
}) => {
  const [assignees, setAssignees] = useState<ZetkinPerson[]>([]);
  const [subjects, setSubjects] = useState<ZetkinPerson[]>([]);
  const [tags, setTags] = useState<ZetkinTag[]>([]);
  const [note, setNote] = useState('');
  const [editedNote, setEditedNote] = useState(false);
  const [title, setTitle] = useState('');

  const messages = useMessages(messageIds);
  const theme = useTheme();
  const router = useRouter();

  const inputSubjectIds = router.query.subject
    ? Array.isArray(router.query.subject)
      ? router.query.subject
      : [router.query.subject]
    : [];

  // Maybe in the future we can support multiple subjects added using
  // the link, but for now a single subject (the first) is enough.
  const subjectId = inputSubjectIds[0];
  personResource(orgId, subjectId).useQuery({
    // Only load if there is a subjectId and no subjects added already
    enabled: !!subjectId && !subjects.length,
    onSuccess: (person) => {
      if (subjects.length == 0) {
        setSubjects([...subjects, person]);
      }
    },
  });

  const journeyFuture = useJourney(parseInt(orgId), parseInt(journeyId));
  const createJourneyInstance = useCreateJourneyInstance(
    parseInt(orgId),
    parseInt(journeyId)
  );

  return (
    <ZUIFuture future={journeyFuture}>
      {(journey) => {
        if (!editedNote) {
          setNote(journey.opening_note_template);
        }
        return (
          <>
            <Head>
              <title>
                {messages.instance.newInstance.title({
                  journey: journey.singular_label,
                })}
              </title>
            </Head>
            <Header
              subtitle={
                <Box
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <Chip
                    label={messages.instance.newInstance.draft()}
                    style={{
                      backgroundColor: theme.palette.grey['300'],
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
              }
              title={
                <ZUIEditTextinPlace
                  allowEmpty
                  onChange={setTitle}
                  placeholder={messages.instance.newInstance.title({
                    journey: journey.singular_label,
                  })}
                  value={title}
                />
              }
            />
            <Box p={3}>
              <Grid container justifyContent="space-between" spacing={2}>
                <Grid item md={6}>
                  <Typography
                    color="secondary"
                    style={{ marginBottom: '1.5rem' }}
                    variant="h6"
                  >
                    <Msg id={messageIds.instance.newInstance.openingNote} />
                  </Typography>
                  <ZUIAutoTextArea
                    onChange={(value) => {
                      setNote(value);
                      setEditedNote(true);
                    }}
                    value={note}
                  />
                  <form
                    onSubmit={(ev) => {
                      ev.preventDefault();
                      createJourneyInstance({
                        assignees,
                        note,
                        subjects,
                        tags,
                        title,
                      });
                    }}
                  >
                    <ZUISubmitCancelButtons
                      onCancel={() => {
                        router.push(`/organize/${orgId}/journeys/${journeyId}`);
                      }}
                      submitDisabled={!editedNote}
                      submitText={messages.instance.newInstance.submitLabel({
                        journey: journey.singular_label,
                      })}
                    />
                  </form>
                </Grid>
                <Grid item md={4}>
                  <JourneyInstanceSidebar
                    journeyInstance={{
                      assignees,
                      next_milestone: null,
                      subjects,
                      tags,
                    }}
                    onAddAssignee={(person) =>
                      setAssignees([...assignees, person])
                    }
                    onAddSubject={(person) =>
                      setSubjects([...subjects, person])
                    }
                    onAssignTag={(tag) => setTags([...tags, tag])}
                    onRemoveAssignee={(person) =>
                      setAssignees(
                        assignees.filter((assignee) => assignee.id != person.id)
                      )
                    }
                    onRemoveSubject={(person) =>
                      setSubjects(
                        subjects.filter((subject) => subject.id != person.id)
                      )
                    }
                    onTagEdited={(editedTag) => {
                      setTags([
                        ...tags.filter((tag) => tag.id != editedTag.id),
                        editedTag,
                      ]);
                    }}
                    onUnassignTag={(tagToUnassign) =>
                      setTags(tags.filter((tag) => tag.id != tagToUnassign.id))
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        );
      }}
    </ZUIFuture>
  );
};

NewJourneyPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default NewJourneyPage;
