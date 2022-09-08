import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Chip, Grid, Typography, useTheme } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useContext, useState } from 'react';

import DefaultLayout from 'layout/organize/DefaultLayout';
import EditTextinPlace from 'zui/atoms/EditTextInPlace';
import Header from 'utils/layout/elements/Header';
import JourneyInstanceSidebar from 'components/organize/journeys/JourneyInstanceSidebar';
import { organizationResource } from 'features/journeys/api/organizations';
import { PageWithLayout } from 'utils/types';
import { personResource } from 'features/profile/api/people';
import { scaffold } from 'utils/next';
import SnackbarContext from 'zui/utils/SnackbarContext';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import { useRouter } from 'next/router';
import ZetkinAutoTextArea from 'components/ZetkinAutoTextArea';
import ZetkinQuery from 'components/ZetkinQuery';
import {
  journeyInstancesResource,
  journeyResource,
} from 'features/journeys/api/journeys';
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

  const { state: orgQueryState } = await organizationResource(
    orgId as string
  ).prefetch(ctx);

  const { state: journeyQueryState } = await journeyResource(
    orgId as string,
    journeyId as string
  ).prefetch(ctx);

  if (
    orgQueryState?.status === 'success' &&
    journeyQueryState?.status === 'success'
  ) {
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

  const { showSnackbar } = useContext(SnackbarContext);

  const intl = useIntl();
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

  const journeyQuery = journeyResource(orgId, journeyId).useQuery({
    onSuccess: (journey) => {
      if (!editedNote) {
        setNote(journey.opening_note_template);
      }
    },
  });

  const createInstanceMutation = journeyInstancesResource(
    orgId,
    journeyId
  ).useCreate();

  return (
    <ZetkinQuery queries={{ journeyQuery }}>
      {({ queries }) => {
        const journey = queries.journeyQuery.data;
        return (
          <>
            <Head>
              <title>
                {intl.formatMessage(
                  { id: 'pages.organizeNewJourneyInstance.title' },
                  { journey: journey.singular_label }
                )}
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
                    label={intl.formatMessage({
                      id: 'pages.organizeNewJourneyInstance.draft',
                    })}
                    style={{
                      backgroundColor: theme.palette.grey['300'],
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
              }
              title={
                <EditTextinPlace
                  allowEmpty
                  onChange={async (value) => setTitle(value)}
                  placeholder={intl.formatMessage(
                    { id: 'pages.organizeNewJourneyInstance.title' },
                    { journey: journey.singular_label }
                  )}
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
                    <Msg id="pages.organizeNewJourneyInstance.openingNote" />
                  </Typography>
                  <ZetkinAutoTextArea
                    onChange={(value) => {
                      setNote(value);
                      setEditedNote(true);
                    }}
                    value={note}
                  />
                  <form
                    onSubmit={async (ev) => {
                      ev.preventDefault();
                      createInstanceMutation.mutate(
                        { assignees, note, subjects, tags, title },
                        {
                          onError: () => {
                            showSnackbar('error');
                          },
                          onSuccess: (newInstance) => {
                            router.push(
                              `/organize/${orgId}/journeys/${journeyId}/${newInstance.id}`
                            );
                          },
                        }
                      );
                    }}
                  >
                    <SubmitCancelButtons
                      onCancel={() => {
                        router.push(`/organize/${orgId}/journeys/${journeyId}`);
                      }}
                      submitDisabled={
                        !editedNote ||
                        createInstanceMutation.isLoading ||
                        createInstanceMutation.isSuccess
                      }
                      submitText={intl.formatMessage(
                        {
                          id: 'pages.organizeNewJourneyInstance.submitLabel',
                        },
                        { journey: journey.singular_label }
                      )}
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
    </ZetkinQuery>
  );
};

NewJourneyPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default NewJourneyPage;
