import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { Box, Chip, Grid, useTheme } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';

import DefaultLayout from 'layout/organize/DefaultLayout';
import EditTextinPlace from 'components/EditTextInPlace';
import Header from 'layout/organize/elements/Header';
import JourneyInstanceSidebar from 'components/organize/journeys/JourneyInstanceSidebar';
import { organizationResource } from 'api/organizations';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SnackbarContext from 'hooks/SnackbarContext';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import { useRouter } from 'next/router';
import ZetkinAutoTextArea from 'components/ZetkinAutoTextArea';
import { journeyInstancesResource, journeyResource } from 'api/journeys';
import { ZetkinJourney, ZetkinPerson } from 'types/zetkin';

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
  const [note, setNote] = useState('');
  const [editedNote, setEditedNote] = useState(false);
  const [title, setTitle] = useState('');

  const { showSnackbar } = useContext(SnackbarContext);

  const intl = useIntl();
  const theme = useTheme();
  const router = useRouter();

  const journeyQuery = journeyResource(orgId, journeyId).useQuery();
  const journey = journeyQuery.data as ZetkinJourney;

  useEffect(() => {
    if (journey && !editedNote) {
      setNote(journey.opening_note_template);
    }
  }, [editedNote, journey, setNote]);

  const mutation = journeyInstancesResource(orgId, journeyId).useCreate();

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
            allowEmpty={true}
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
                mutation.mutate(
                  { assignees, note, subjects, title },
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
                  !editedNote || mutation.isLoading || mutation.isSuccess
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
              }}
              onAddAssignee={(person) => setAssignees([...assignees, person])}
              onAddSubject={(person) => setSubjects([...subjects, person])}
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
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

NewJourneyPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default NewJourneyPage;
