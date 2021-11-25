import { FunctionComponent } from 'react';
import { Add, Person } from '@material-ui/icons';
import { Box, Fab } from '@material-ui/core';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import { ZetkinViewColumn, ZetkinViewRow } from 'types/zetkin';


interface ZetkinViewTableProps {
    columns: ZetkinViewColumn[];
    onAddColumn: () => void;
    rows: ZetkinViewRow[];
}

const ZetkinViewTable: FunctionComponent<ZetkinViewTableProps> = ({ columns, onAddColumn, rows }) => {
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

    const newColumn = {
        disableColumnMenu: true,
        disableExport: true,
        disableReorder: true,
        field: 'add',
        filterable: false,
        renderHeader: () => {
            return (
                <Box>
                    <Fab onClick={ () => onAddColumn() } size="small">
                        <Add/>
                    </Fab>
                </Box>
            );
        },
        resizable: false,
        sortable: false,
        width: 80,
    };

    const gridColumns = [
        avatarColumn,
        ...columns.map((col, index) => ({
            field: index.toString(),
            headerName: col.title,
            minWidth: 200,
        })),
        newColumn,
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
