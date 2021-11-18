import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import getViews from 'fetching/views/getViews';
import { PageWithLayout } from 'types';
import PeopleLayout from 'components/layout/organize/PeopleLayout';
import { scaffold } from 'utils/next';
import ZetkinDateTime from 'components/ZetkinDateTime';
import ZetkinSection from 'components/ZetkinSection';
import { ZetkinView } from 'types/zetkin';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'misc.formDialog', 'misc.speedDial',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['views', orgId], getViews(orgId as string, ctx.apiFetch));
    const viewsQueryState = ctx.queryClient.getQueryState<ZetkinView[]>(['views', orgId]);

    if (
        viewsQueryState?.status === 'success'
    ) {
        return {
            props: {
                orgId,
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

type PeopleViewsPageProps = {
    orgId: string;
};

const PeopleViewsPage: PageWithLayout<PeopleViewsPageProps> = ({ orgId }) => {
    const intl = useIntl();
    const { data: views } = useQuery(['views', orgId], getViews(orgId));

    return (
        <>
            <Head>
                <title>
                    { intl.formatMessage({ id:'layout.organize.people.title' })
                    + ' - ' +
                    intl.formatMessage({ id:'layout.organize.people.tabs.views' }) }
                </title>
            </Head>
            <ZetkinSection title="Suggested">
                <Box display="grid" gridGap={ 20 } gridTemplateColumns="repeat( auto-fit, minmax(450px, 1fr) )">

                </Box>
            </ZetkinSection>
            <Table aria-label="Views list">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Title
                        </TableCell>
                        <TableCell>
                            Date Created
                        </TableCell>
                        <TableCell>
                            Owner
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { views?.map(view => {
                        return (
                            <TableRow key={ view.id }>
                                <TableCell>
                                    { view.title }
                                </TableCell>
                                <TableCell>
                                    <ZetkinDateTime datetime={ view.created } />
                                </TableCell>
                                <TableCell>
                                    { view.owner.name }
                                </TableCell>
                            </TableRow>
                        );
                    }) }
                </TableBody>
            </Table>
        </>
    );
};

PeopleViewsPage.getLayout = function getLayout(page) {
    return (
        <PeopleLayout>
            { page }
        </PeopleLayout>
    );
};

export default PeopleViewsPage;
