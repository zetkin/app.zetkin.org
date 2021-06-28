import { grey } from '@material-ui/core/colors';
import { useIntl } from 'react-intl';
import { Box,  makeStyles, Tab, Tabs } from '@material-ui/core';
import { ChangeEvent, useState } from 'react';
import { FunctionComponent, ReactText } from 'react';

interface OrganizeCampaignTabsProps {
    currentTab?: string;
    onSelectTab: (key : ReactText) => void;
}

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: grey[100],
        flexGrow: 1,
    },
}));

const OrganizeCampaignTabs: FunctionComponent<OrganizeCampaignTabsProps> = ({ children, currentTab, onSelectTab }) => {
    const intl = useIntl();
    const classes = useStyles();
    const [value, setValue] = useState(currentTab);

    const handleChange = (event: ChangeEvent<unknown>, newValue: string) => {
        setValue(newValue);
        onSelectTab(newValue);
    };

    return (
        <div className={ classes.root }>
            <Tabs aria-label="campaign tabs" indicatorColor="primary" onChange={ handleChange } textColor="primary" value={ value }>
                <Tab label={ intl.formatMessage({
                    id: 'layout.organize.campaigns.summary',
                }) } value="summary"
                />
                <Tab label={ intl.formatMessage({
                    id: 'layout.organize.campaigns.calendar',
                }) } value="calendar"
                />
                <Tab label={ intl.formatMessage({
                    id: 'layout.organize.campaigns.insights',
                }) } value="insights"
                />
            </Tabs>
            <Box role="tabpanel">
                { children }
            </Box>
        </div>
    );
};

export default OrganizeCampaignTabs;