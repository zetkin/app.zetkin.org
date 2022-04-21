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
import { tagGroupsResource } from 'api/tags';
import TagsManager from 'components/organize/TagsManager';
import ZetkinQuery from 'components/ZetkinQuery';
import { ZetkinTagPostBody } from 'types/zetkin';
import { personResource, personTagsResource } from 'api/people';
import { scaffold, ScaffoldedGetServerSideProps } from 'utils/next';

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
    useAdd,
    useCreate,
    useQuery: usePersonTagsQuery,
    useAvailableTagsQuery,
    useRemove,
  } = personTagsResource(orgId as string, personId as string);
  const addTagMutation = useAdd();
  const createTagMutation = useCreate();
  const removeTagMutation = useRemove();
  const personTagsQuery = usePersonTagsQuery();
  const organizationTagsQuery = useAvailableTagsQuery();

  const { data: person } = personResource(
    props.orgId,
    props.personId
  ).useQuery();

  const tagsGroupMutation = tagGroupsResource(orgId as string).useAdd();

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
              availableTags={organizationTagsQuery.data || []}
              onAssignTag={(tag) =>
                addTagMutation.mutate(tag.id, {
                  onError: () => showSnackbar('error'),
                })
              }
              onCreateTag={async (tag) => {
                if ('group' in tag) {
                  // If creating a new group, has group object
                  const newGroup = await tagsGroupMutation.mutateAsync(
                    tag.group
                  );
                  const tagWithNewGroup = {
                    ...tag,
                    group: undefined,
                    group_id: newGroup.id,
                  };
                  await createTagMutation.mutateAsync(
                    tagWithNewGroup as ZetkinTagPostBody,
                    {
                      onError: () => showSnackbar('error'),
                    }
                  );
                } else {
                  // Add tag with existing or no group
                  createTagMutation.mutate(tag, {
                    onError: () => showSnackbar('error'),
                  });
                }
              }}
              onUnassignTag={(tag) =>
                removeTagMutation.mutate(tag.id, {
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
