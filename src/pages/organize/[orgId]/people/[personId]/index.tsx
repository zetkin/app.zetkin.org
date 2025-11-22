import { GetServerSideProps } from 'next';
import { Close } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import { Suspense, useContext, useState } from 'react';

import BackendApiClient from 'core/api/client/BackendApiClient';
import messageIds from 'features/profile/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import PersonDetailsCard from 'features/profile/components/PersonDetailsCard';
import PersonJourneysCard from 'features/profile/components/PersonJourneysCard';
import PersonOrganizationsCard from 'features/profile/components/PersonOrganizationsCard';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useJourneys from 'features/journeys/hooks/useJourneys';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import usePerson from 'features/profile/hooks/usePerson';
import usePersonTags from 'features/tags/hooks/usePersonTags';
import useTagging from 'features/tags/hooks/useTagging';
import ZUIFuture from 'zui/ZUIFuture';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { scaffold, ScaffoldedGetServerSideProps } from 'utils/next';
import { ZetkinPerson } from 'utils/types/zetkin';
import PersonLngLatMap from 'features/profile/components/PersonLngLatMap';
import usePersonNotes from 'features/profile/hooks/usePersonNotes';
import ZUIDate from 'zui/ZUIDate';
import ZUISection from 'zui/ZUISection';
import ZUITextEditor from 'zui/ZUITextEditor';
import useAddPersonNote from 'features/profile/hooks/useAddPersonNote';
import useDeletePersonNote from 'features/profile/hooks/useDeletePersonNote';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';

export const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people'],
};

export const getPersonScaffoldProps: ScaffoldedGetServerSideProps = async (
  ctx
) => {
  const { orgId, personId } = ctx.params!;

  try {
    const apiClient = new BackendApiClient(ctx.req.headers);
    await apiClient.get<ZetkinPerson>(`/api/orgs/${orgId}/people/${personId}`);
    return {
      props: {
        orgId,
        personId,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export const getServerSideProps: GetServerSideProps = scaffold(
  getPersonScaffoldProps,
  scaffoldOptions
);

const PersonProfilePage: PageWithLayout = () => {
  const { orgId, personId } = useNumericRouteParams();

  const [newNote, setNewNote] = useState('');

  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { assignToPerson, removeFromPerson } = useTagging(orgId);
  const fieldsFuture = useCustomFields(orgId);
  const personFuture = usePerson(orgId, personId);
  const person = personFuture.data;
  const personTagsFuture = usePersonTags(orgId, personId);
  const journeysFuture = useJourneys(orgId);
  const notes = usePersonNotes(orgId, personId);
  const addPersonNote = useAddPersonNote(orgId, personId);
  const deletePersonNote = useDeletePersonNote(orgId, personId);

  if (!person) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {person?.first_name} {person?.last_name}
        </title>
      </Head>
      <Grid container direction="row" spacing={6}>
        <Grid size={12}>
          <ZUIFuture future={fieldsFuture}>
            {(fields) => (
              <PersonLngLatMap
                customFields={fields}
                height="30vh"
                person={person}
              />
            )}
          </ZUIFuture>
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ZUIFuture future={fieldsFuture}>
            {(fields) => (
              <PersonDetailsCard customFields={fields} person={person} />
            )}
          </ZUIFuture>
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ZUIFuture future={personTagsFuture}>
            {(personTags) => (
              <TagManagerSection
                assignedTags={personTags}
                onAssignTag={async (tag) => {
                  try {
                    await assignToPerson(personId, tag.id, tag.value);
                  } catch (err) {
                    showSnackbar('error');
                  }
                }}
                onUnassignTag={async (tag) => {
                  try {
                    await removeFromPerson(personId, tag.id);
                  } catch (err) {
                    showSnackbar('error');
                  }
                }}
                submitCreateTagLabel={messages.tags.createAndApplyLabel()}
              />
            )}
          </ZUIFuture>
        </Grid>
        {!!journeysFuture.data?.length && (
          <Grid size={{ lg: 4, xs: 12 }}>
            <PersonJourneysCard orgId={orgId} personId={personId} />
          </Grid>
        )}
        <Grid size={{ lg: 4, xs: 12 }}>
          <PersonOrganizationsCard orgId={orgId} personId={personId} />
        </Grid>
        <Suspense fallback={<CircularProgress />}>
          <Grid size={{ lg: 4, xs: 12 }}>
            <ZUISection title={`Notes about ${person.first_name}`}>
              <Card sx={{ padding: 1 }}>
                <Box sx={{ padding: 1 }}>
                  <ZUITextEditor
                    onChange={(value) => setNewNote(value.trim())}
                    placeholder="Write a note"
                    showStyling={false}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      paddingY: 1,
                    }}
                  >
                    <Button
                      disabled={!newNote.trim()}
                      onClick={() => addPersonNote(newNote)}
                      variant="outlined"
                    >
                      Add note
                    </Button>
                  </Box>
                </Box>
                <Stack divider={<Divider flexItem />} gap={2}>
                  {notes
                    .sort((a, b) => {
                      return (
                        new Date(b.created).getTime() -
                        new Date(a.created).getTime()
                      );
                    })
                    .map((note) => (
                      <Box
                        key={note.id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          padding: 1,
                        }}
                      >
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography color="secondary">
                            <ZUIDate datetime={note.created} />
                          </Typography>
                          <IconButton
                            onClick={() =>
                              showConfirmDialog({
                                onSubmit: () => deletePersonNote(note.id),
                                title: 'Confirm deleting note',
                                warningText: `Are you sure you want to delete this note about ${person.first_name}? Deleting a note can not be undone.`,
                              })
                            }
                          >
                            <Close />
                          </IconButton>
                        </Box>
                        <Typography>{note.text}</Typography>
                        <Box
                          sx={{ alignItems: 'center', display: 'flex', gap: 1 }}
                        >
                          <Avatar
                            src={`/api/orgs/${orgId}/people/${note.author.id}/avatar`}
                            sx={{ height: 28, width: 28 }}
                          />
                          <Typography>{note.author.name}</Typography>
                          <Divider flexItem orientation="vertical" />
                          <Avatar
                            src={`/api/orgs/${note.organization.id}/avatar`}
                            sx={{ height: 28, width: 28 }}
                          />
                          <Typography>{note.organization.title}</Typography>
                        </Box>
                      </Box>
                    ))}
                </Stack>
              </Card>
            </ZUISection>
          </Grid>
        </Suspense>
      </Grid>
    </>
  );
};

PersonProfilePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonProfilePage;
