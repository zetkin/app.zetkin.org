import { GetServerSideProps } from 'next';
import { Grid } from '@material-ui/core';
import Head from 'next/head';
import { useContext } from 'react';
import { useRouter } from 'next/router';

import { PageWithLayout } from 'types';
import PersonDetailsCard from 'components/organize/people/PersonDetailsCard';
import PersonOrganizationsCard from 'components/organize/people/PersonOrganizationsCard';
import SinglePersonLayout from 'layout/organize/SinglePersonLayout';
import SnackbarContext from 'hooks/SnackbarContext';
import TagsManager from 'components/organize/TagsManager';
import ZetkinQuery from 'components/ZetkinQuery';
import { personResource, personTagsResource } from 'api/people';
import { scaffold, ScaffoldedGetServerSideProps } from 'utils/next';
import { tagGroupsResource, tagsResource } from 'api/tags';
import {
  useCreateTag,
  useEditTag,
} from 'components/organize/TagsManager/utils';

export const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people'],
};

export const getPersonScaffoldProps: ScaffoldedGetServerSideProps = async (
  ctx
) => {
  const { orgId, personId } = ctx.params!;

  const { prefetch } = personResource(orgId as string, personId as string);
  const { state: personQueryState } = await prefetch(ctx);

  if (personQueryState?.status === 'success') {
    return {
      props: {
        orgId,
        personId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export const getServerSideProps: GetServerSideProps = scaffold(
  getPersonScaffoldProps,
  scaffoldOptions
);

export type PersonPageProps = {
  orgId: string;
  personId: string;
};

const PersonProfilePage: PageWithLayout<PersonPageProps> = (props) => {
  const { orgId, personId } = useRouter().query;
  const { showSnackbar } = useContext(SnackbarContext);

  const {
    useAssign,
    useQuery: usePersonTagsQuery,
    useUnassign,
  } = personTagsResource(orgId as string, personId as string);
  const { useQuery: useAvailableTagsQuery } = tagsResource(orgId as string);
  const assignTagMutation = useAssign();
  const unassignTagMutation = useUnassign();
  const personTagsQuery = usePersonTagsQuery();
  const organizationTagsQuery = useAvailableTagsQuery();

  const { data: person } = personResource(
    props.orgId,
    props.personId
  ).useQuery();

  const { useQuery: useTagGroupsQuery } = tagGroupsResource(orgId as string);
  const tagsGroupsQuery = useTagGroupsQuery();

  const createTag = useCreateTag();
  const editTag = useEditTag();

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
        <Grid item lg={4} xs={12}>
          <PersonDetailsCard person={person} />
        </Grid>
        <Grid item lg={4} xs={12}>
          <PersonOrganizationsCard {...props} />
        </Grid>
        <Grid item lg={4} xs={12}>
          <ZetkinQuery queries={{ organizationTagsQuery, personTagsQuery }}>
            <TagsManager
              assignedTags={personTagsQuery.data || []}
              availableGroups={tagsGroupsQuery.data || []}
              availableTags={organizationTagsQuery.data || []}
              onAssignTag={(tag) =>
                assignTagMutation.mutate(tag.id, {
                  onError: () => showSnackbar('error'),
                })
              }
              onCreateTag={async (tag) => {
                const newTag = await createTag(tag);
                assignTagMutation.mutate(newTag.id, {
                  onError: () => showSnackbar('error'),
                });
              }}
              onEditTag={editTag}
              onUnassignTag={(tag) =>
                unassignTagMutation.mutate(tag.id, {
                  onError: () => showSnackbar('error'),
                })
              }
            />
          </ZetkinQuery>
        </Grid>
      </Grid>
    </>
  );
};

PersonProfilePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonProfilePage;
