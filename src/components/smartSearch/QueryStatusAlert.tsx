import { Button } from '@mui/material';
import { FormattedMessage as Msg } from 'react-intl';
import { QUERY_STATUS } from 'types/smartSearch';
import { Alert,AlertColor  } from '@mui/material';

const SEVERITY: {[key in QUERY_STATUS]: AlertColor} =  {
    [QUERY_STATUS.ASSIGNED]: 'success',
    [QUERY_STATUS.EDITABLE]: 'info',
    [QUERY_STATUS.NEW]: 'warning',
    [QUERY_STATUS.PUBLISHED]: 'info',
};

const ACTION_LABEL: {[key in QUERY_STATUS]: string} = {
    [QUERY_STATUS.ASSIGNED]: 'pages.assignees.links.readOnly',
    [QUERY_STATUS.EDITABLE]: 'pages.assignees.links.edit',
    [QUERY_STATUS.NEW]: 'pages.assignees.links.create',
    [QUERY_STATUS.PUBLISHED]:  'pages.assignees.links.readOnly',
};

const QueryStatusAlert: React.FunctionComponent<{
    openDialog: () => void;
    status: QUERY_STATUS;
}> = ({ status, openDialog }) => {
    return (
        <Alert
            action={
                <Button color="inherit" onClick={ openDialog }>
                    <Msg id={ ACTION_LABEL[status] } />
                </Button>
            }
            severity={ SEVERITY[status] }
            variant="filled">
            <Msg id={ `pages.assignees.queryStates.${status}` }/>
        </Alert>
    );
};

export default QueryStatusAlert;
