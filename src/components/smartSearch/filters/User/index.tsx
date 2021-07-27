import { FormEvent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Divider, MenuItem, Typography } from '@material-ui/core';

import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'hooks/useSmartSearchFilter';
import { NewSmartSearchFilter, OPERATION, SmartSearchFilterWithId, UserFilterConfig, ZetkinSmartSearchFilter } from 'types/smartSearch';

interface UserProps {
    filter:  SmartSearchFilterWithId<UserFilterConfig> |  NewSmartSearchFilter ;
    onSubmit: (filter: SmartSearchFilterWithId<UserFilterConfig> | ZetkinSmartSearchFilter<UserFilterConfig>) => void;
    onCancel: () => void;
}

const User = ({ onSubmit, onCancel, filter: initialFilter }: UserProps): JSX.Element => {

    const { filter, setConfig, setOp } = useSmartSearchFilter<UserFilterConfig>(initialFilter, { is_user: true });
    const handleAddFilter = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(filter);
    };

    return (
        <form onSubmit={ e => handleAddFilter(e) }>
            <Typography style={{ lineHeight: 'unset', marginBottom: '2rem' }} variant="h4">
                <Msg id="misc.smartSearch.user.inputString" values={{
                    addRemoveSelect: (
                        <StyledSelect onChange={ e => setOp(e.target.value as OPERATION) }
                            value={ filter.op }>
                            <MenuItem key={ OPERATION.ADD } value={ OPERATION.ADD }>
                                <Msg id="misc.smartSearch.user.addRemoveSelect.add"/>
                            </MenuItem>
                            <MenuItem key={ OPERATION.SUB } value={ OPERATION.SUB }>
                                <Msg id="misc.smartSearch.user.addRemoveSelect.sub" />
                            </MenuItem>
                        </StyledSelect>
                    ),
                    connectedSelect: (
                        <StyledSelect
                            onChange={ (e) => {
                                setConfig({
                                    ...filter.config,
                                    is_user: !!e.target.value, // convert numbers to boolean since MenuItem cannot take boolean as props
                                });
                            } }
                            value={ +filter.config.is_user }>
                            <MenuItem key={ 1 } value={ 1 }>
                                <Msg id="misc.smartSearch.user.connectedSelect.true"/>
                            </MenuItem>
                            <MenuItem key={ 0 } value={ 0 }>
                                <Msg id="misc.smartSearch.user.connectedSelect.false"/>
                            </MenuItem>
                        </StyledSelect>
                    ),
                }}
                />
            </Typography>
            <Divider />
            <Typography variant="h6">
                <Msg id="misc.smartSearch.headers.examples"/>
            </Typography>
            <Typography color="textSecondary">
                <Msg id="misc.smartSearch.user.examples.one"/>
                <br />
                <Msg id="misc.smartSearch.user.examples.two"/>
            </Typography>

            <Box display="flex" justifyContent="flex-end" m={ 1 } style={{ gap: '1rem' }}>
                <Button color="primary" onClick={ onCancel }>
                    <Msg id="misc.smartSearch.buttonLabels.cancel"/>
                </Button>
                <Button color="primary" type="submit" variant="contained">
                    { ('id' in filter) ? <Msg id="misc.smartSearch.buttonLabels.edit"/>: <Msg id="misc.smartSearch.buttonLabels.add"/> }
                </Button>
            </Box>
        </form>
    );
};

export default User;
