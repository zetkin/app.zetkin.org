import { Person } from '@material-ui/icons';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import { ZetkinViewColumn, ZetkinViewRow } from 'types/zetkin';


interface ZetkinViewTableProps {
    columns: ZetkinViewColumn[];
    rows: ZetkinViewRow[];
}

const ZetkinViewTable = ({ columns, rows }: ZetkinViewTableProps): JSX.Element => {
    const avatarColumn : GridColDef = {
        disableColumnMenu: true,
        disableExport: true,
        disableReorder: true,
        field: 'id',
        filterable: false,
        headerName: ' ',
        renderCell: (params) => {
            const url = `/api/orgs/1/people/${params.value}/avatar`;
            return (
                <img
                    alt="Avatar"
                    src={ url }
                    style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                    }}
                />
            );
        },
        renderHeader: () => {
            return <Person/>;
        },
        resizable: false,
        sortable: false,
        width: 50,
    };

    const gridColumns = [
        avatarColumn,
        ...columns.map((col, index) => ({
            field: index.toString(),
            headerName: col.title,
            minWidth: 200,
        })),
    ];

    const gridRows = rows.map(row => ({
        id: row.id,
        ...row.content,
    }));

    return (
        <DataGridPro
            columns={ gridColumns }
            rows={ gridRows }
        />
    );
};

export default ZetkinViewTable;
