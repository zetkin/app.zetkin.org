import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import getViews from 'fetching/views/getViews';
import ZetkinDateTime from 'components/ZetkinDateTime';
import ZetkinQuery from 'components/ZetkinQuery';

const ViewsListTable: React.FunctionComponent = () => {
    const intl = useIntl();
    const { orgId } = useRouter().query;
    const viewsQuery = useQuery(['views', orgId], getViews(orgId as string));

    return (
        <Table aria-label="Views list">
            <TableHead>
                <TableRow>
                    <TableCell>
                        <b>{ intl.formatMessage({ id: 'pages.people.views.viewsList.columns.title' }) }</b>
                    </TableCell>
                    <TableCell>
                        <b>{ intl.formatMessage({ id: 'pages.people.views.viewsList.columns.created' }) }</b>
                    </TableCell>
                    <TableCell>
                        <b>{ intl.formatMessage({ id: 'pages.people.views.viewsList.columns.owner' }) }</b>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <ZetkinQuery
                    queries={{ viewsQuery }}>
                    { ({ queries: { viewsQuery: { data: views } } }) => {
                        if (views.length === 0) {
                            return (
                                <TableRow data-testid="empty-views-list-row">
                                    <TableCell colSpan={ 3 }>
                                        { intl.formatMessage({ id: 'pages.people.views.viewsList.empty' }) }
                                    </TableCell>
                                </TableRow>
                            );
                        }
                        return views.map(view => {
                            return (
                                <Link key={ view.id } href={ `/organize/1/people/views/${view.id}` } passHref>
                                    <TableRow
                                        key={ view.id }
                                        component="a"
                                        data-testid="view-list-table-row"
                                        hover
                                        style={{ textDecoration: 'none' }}>
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
                                </Link>
                            );
                        });
                    } }
                </ZetkinQuery>
            </TableBody>
        </Table>
    );
};

export default ViewsListTable;
