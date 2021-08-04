import { FormEvent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Divider, MenuItem, Typography } from '@material-ui/core';

import getActivities from 'fetching/getActivities';
import getCampaigns from 'fetching/getCampaigns';
import getLocations from 'fetching/getLocations';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import useSmartSearchFilter from 'hooks/useSmartSearchFilter';
import { CampaignParticipationConfig, NewSmartSearchFilter, OPERATION, SmartSearchFilterWithId, ZetkinSmartSearchFilter } from 'types/smartSearch';

const DEFAULT_VALUE = 'any';

const removeKey = (config: CampaignParticipationConfig, deleteKey: string): CampaignParticipationConfig => {
    return deleteKey in config ? Object.entries(config)
        .reduce((result: CampaignParticipationConfig, [key, value]) => {
            if (key !== deleteKey) {
                return {
                    ...result,
                    [key] : value,
                };
            }
            return result;
        }, { operator: config.operator, state: config.state }) : config;
};

interface CampaignParticipationProps {
    filter:  SmartSearchFilterWithId<CampaignParticipationConfig> |  NewSmartSearchFilter ;
    onSubmit: (filter: SmartSearchFilterWithId<CampaignParticipationConfig> | ZetkinSmartSearchFilter<CampaignParticipationConfig>) => void;
    onCancel: () => void;
}

const CampaignParticipation = ({ onSubmit, onCancel, filter: initialFilter }:CampaignParticipationProps): JSX.Element => {
    const { orgId } = useRouter().query;
    const campQuery = useQuery(['campaigns', orgId], getCampaigns(orgId as string));
    const activitiesQuery = useQuery(['activities', orgId], getActivities(orgId as string));
    const locationsQuery = useQuery(['locations', orgId], getLocations(orgId as string));
    const campaigns = campQuery?.data || [];
    const activities = activitiesQuery?.data || [];
    const locations = locationsQuery?.data || [];

    const { filter, setConfig, setOp } = useSmartSearchFilter<CampaignParticipationConfig>(initialFilter, {
        operator: 'in', state: 'booked',
    });

    const handleAddFilter = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(filter);
    };

    const handleTimeFrameChange = (range: {after?: string; before?: string}) => {
        const { state, operator, campaign, activity, location } = filter.config;
        setConfig({
            activity, campaign,location, operator, state,
            ...range,
        });
    };

    const handleCampaignSelectChange = (campValue: string) => {
        if (campValue === DEFAULT_VALUE) {
            setConfig(removeKey(filter.config, 'campaign'));
        }
        else {
            setConfig({ ...filter.config, campaign: +campValue });
        }
    };

    const handleActivitySelectChange = (activityValue: string) => {
        if (activityValue === DEFAULT_VALUE) {
            setConfig(removeKey(filter.config, 'activity'));
        }
        else {
            setConfig({ ...filter.config, activity: +activityValue });
        }
    };

    const handleLocationSelectChange = (locationValue: string) => {
        if (locationValue === DEFAULT_VALUE) {
            setConfig(removeKey(filter.config, 'location'));
        }
        else {
            setConfig({ ...filter.config, location: +locationValue  });
        }
    };

    return (
        <form onSubmit={ e => handleAddFilter(e) }>
            <Typography style={{ lineHeight: 'unset', marginBottom: '2rem' }} variant="h4">
                <Msg id="misc.smartSearch.campaign_participation.inputString" values={{
                    activitySelect: (
                        <StyledSelect
                            onChange={ e => handleActivitySelectChange(e.target.value) }
                            SelectProps={{ renderValue: function getLabel(value) {
                                return value === DEFAULT_VALUE ?
                                    <Msg id="misc.smartSearch.campaign_participation.activitySelect.any" /> :
                                    <Msg
                                        id="misc.smartSearch.campaign_participation.activitySelect.activity"
                                        values={{
                                            activity: activities.find(l=> l.id === value)?.title }}
                                    />;
                            } }}
                            value={ filter.config.activity || DEFAULT_VALUE }>
                            <MenuItem key={ DEFAULT_VALUE } value={ DEFAULT_VALUE }>
                                <Msg id="misc.smartSearch.campaign_participation.activitySelect.any" />
                            </MenuItem>
                            { activities.map(a => (
                                <MenuItem key={ a.id } value={ a.id }>
                                    { a.title }
                                </MenuItem>
                            )) }
                        </StyledSelect>
                    ),
                    addRemoveSelect: (
                        <StyledSelect onChange={ e => setOp(e.target.value as OPERATION) }
                            value={ filter.op }>
                            <MenuItem key={ OPERATION.ADD } value={ OPERATION.ADD }>
                                <Msg id="misc.smartSearch.campaign_participation.addRemoveSelect.add"/>
                            </MenuItem>
                            <MenuItem key={ OPERATION.SUB } value={ OPERATION.SUB }>
                                <Msg id="misc.smartSearch.campaign_participation.addRemoveSelect.sub" />
                            </MenuItem>
                        </StyledSelect>
                    ),
                    bookedSelect: (
                        <StyledSelect
                            onChange={
                                e => setConfig({ ...filter.config, state: e.target.value as 'booked' | 'signed_up' }) }
                            value={ filter.config.state }>
                            <MenuItem key="booked" value="booked">
                                <Msg id="misc.smartSearch.campaign_participation.bookedSelect.booked" />
                            </MenuItem>
                            <MenuItem
                                key="signed_up"
                                value="signed_up">
                                <Msg id="misc.smartSearch.campaign_participation.bookedSelect.signed_up" />
                            </MenuItem>
                        </StyledSelect>
                    ),
                    campaignSelect: (
                        <StyledSelect
                            onChange={ e => {
                                handleCampaignSelectChange(e.target.value);
                            } }
                            SelectProps={{ renderValue: function getLabel(value) {
                                return value === DEFAULT_VALUE ?
                                    <Msg id="misc.smartSearch.campaign_participation.campaignSelect.any" />
                                    : <Msg id="misc.smartSearch.campaign_participation.campaignSelect.campaign" values={{
                                        campaign: campaigns.find(c=> c.id === value)?.title }}
                                    />;
                            } }}
                            value={ filter.config.campaign || DEFAULT_VALUE }>
                            <MenuItem key={ DEFAULT_VALUE } value={ DEFAULT_VALUE }>
                                <Msg id="misc.smartSearch.campaign_participation.campaignSelect.any" />
                            </MenuItem>
                            { campaigns.map(c => (
                                <MenuItem key={ c.id } value={ c.id }>
                                    { c.title }
                                </MenuItem>
                            )) }
                        </StyledSelect>
                    ),
                    haveSelect: (
                        <StyledSelect
                            onChange={
                                e => setConfig({ ...filter.config, operator: e.target.value as 'in' | 'notin' }) }
                            value={ filter.config.operator }>
                            <MenuItem key="in" value="in">
                                <Msg id="misc.smartSearch.campaign_participation.haveSelect.in" />
                            </MenuItem>
                            <MenuItem key="notin" value="notin">
                                <Msg id="misc.smartSearch.campaign_participation.haveSelect.notin" />
                            </MenuItem>
                        </StyledSelect>
                    ),
                    locationSelect: (
                        <StyledSelect
                            onChange={ e => handleLocationSelectChange(e.target.value) }
                            SelectProps={{ renderValue: function getLabel(value) {
                                return value === DEFAULT_VALUE ?
                                    <Msg id="misc.smartSearch.campaign_participation.locationSelect.any" />
                                    : <Msg id="misc.smartSearch.campaign_participation.locationSelect.location" values={{
                                        location: locations.find(l=> l.id === value)?.title }}
                                    />;
                            } }}
                            value={ filter.config.location || DEFAULT_VALUE }>
                            <MenuItem key={ DEFAULT_VALUE } value={ DEFAULT_VALUE }>
                                <Msg id="misc.smartSearch.campaign_participation.locationSelect.any" />
                            </MenuItem>
                            { locations.map(l => (
                                <MenuItem key={ l.id } value={ l.id }>
                                    { l.title }
                                </MenuItem>
                            )) }
                        </StyledSelect>
                    ),
                    timeFrame: (
                        <TimeFrame filterConfig={{ after: filter.config.after, before: filter.config.before }} onChange={ handleTimeFrameChange }/>
                    ),
                }}
                />
            </Typography>
            <Divider />
            <Typography variant="h6">
                <Msg id="misc.smartSearch.headers.examples"/>
            </Typography>
            <Typography color="textSecondary">
                <Msg id="misc.smartSearch.most_active.examples.one"/>
                <br />
                <Msg id="misc.smartSearch.most_active.examples.two"/>
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

export default CampaignParticipation;
