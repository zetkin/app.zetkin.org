import { Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { GridSortModel } from '@mui/x-data-grid-pro';
import { ImportExport } from '@material-ui/icons';

interface Props {
    onChangeSortModel: (model: GridSortModel) => void;
    sortModel: GridSortModel;
}

const ViewDataTableSorting: React.FunctionComponent<Props> = ({ onChangeSortModel, sortModel }) => {

    const onChange = (model: GridSortModel) => onChangeSortModel(model);

    return (
        <Button
            data-testid="ViewDataTableToolbar-showSorting"
            onClick={ () => onChange(sortModel) }
            startIcon={ <ImportExport /> }>
            <FormattedMessage id="misc.views.showSorting" />
        </Button>
    );
};

export default ViewDataTableSorting;
