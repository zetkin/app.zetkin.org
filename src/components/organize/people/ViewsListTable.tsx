import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import getViews from 'fetching/views/getViews';
import ZetkinDateTime from 'components/ZetkinDateTime';
import ZetkinQuery from 'components/ZetkinQuery';

const ViewsListTable: React.FunctionComponent = () => {
    const { orgId } = useRouter().query;
    const viewsQuery = useQuery(['views', orgId], getViews(orgId as string));

    return (
        <Table aria-label="Views list">
            <TableHead>
                <TableRow>
                    <TableCell>
                        <b>Title</b>
                    </TableCell>
                    <TableCell>
                        <b>Date Created</b>
                    </TableCell>
                    <TableCell>
                        <b>Owner</b>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <ZetkinQuery
                    query={ viewsQuery }>
                    { ({ query: { data: views } }) => {
                        return views.map(view => {
                            return (
                                <TableRow key={ view.id } hover>
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
                        });
                    } }
                </ZetkinQuery>
            </TableBody>
        </Table>
    );
};

export default ViewsListTable;
