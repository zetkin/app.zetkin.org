import { DataGridPro } from '@mui/x-data-grid-pro';

import { ZetkinViewColumn, ZetkinViewRow } from 'types/zetkin';


interface ZetkinViewTableProps {
    columns: ZetkinViewColumn[];
    rows: ZetkinViewRow[];
}

const ZetkinViewTable = ({ columns, rows }: ZetkinViewTableProps): JSX.Element => {
    const gridColumns = columns.map((col, index) => ({
        field: index.toString(),
        headerName: col.title,
        minWidth: 200,
    }));

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
