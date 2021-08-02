import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Button, Divider, MenuItem, Typography } from '@material-ui/core';
import { FormEvent, useEffect, useState } from 'react';

import getSurveys from 'fetching/getSurveys';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import useSmartSearchFilter from 'hooks/useSmartSearchFilter';
import { NewSmartSearchFilter, OPERATION, SmartSearchFilterWithId, SurveySubmissionFilterConfig, TIME_FRAME, ZetkinSmartSearchFilter } from 'types/smartSearch';

const DEFAULT_VALUE = 'none';

interface SurveySubmissionProps {
    filter:  SmartSearchFilterWithId<SurveySubmissionFilterConfig> |  NewSmartSearchFilter ;
    onSubmit: (filter: SmartSearchFilterWithId<SurveySubmissionFilterConfig> | ZetkinSmartSearchFilter<SurveySubmissionFilterConfig>) => void;
    onCancel: () => void;
}

const SurveySubmission = ({ onSubmit, onCancel, filter: initialFilter }: SurveySubmissionProps): JSX.Element => {
    const { orgId } = useRouter().query;
    const surveysQuery = useQuery(['surveys', orgId], getSurveys(orgId as string));
    const surveys = surveysQuery.data || [];

    const [submittable, setSubmittable] = useState(false);

    const { filter, setConfig, setOp } = useSmartSearchFilter<SurveySubmissionFilterConfig>(initialFilter);

    useEffect(() => {
        if (surveys.length) {
            setConfig({
                operator: 'submitted',
                survey: filter.config.survey || surveys[0].id });
            setSubmittable(true);
        }
    }, [surveys]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAddFilter = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(filter);
    };

    const handleTimeFrameChange = (range: {after?: string; before?: string}) => {
        const { operator, survey } = filter.config;
        setConfig({
            operator, survey,
            ...range,
        });
    };

    const handleSurveySelectChange = (surveyValue: string) => {
        if (surveyValue === DEFAULT_VALUE) {
            setSubmittable(false);
        }
        else {
            setConfig({ ...filter.config, survey: +surveyValue });
            setSubmittable(true);
        }
    };

    return (
        <form onSubmit={ e => handleAddFilter(e) }>
            <Typography style={{ lineHeight: 'unset', marginBottom: '2rem' }} variant="h4">
                <Msg id="misc.smartSearch.survey_submission.inputString" values={{
                    addRemoveSelect: (
                        <StyledSelect onChange={ e => setOp(e.target.value as OPERATION) }
                            value={ filter.op }>
                            <MenuItem key={ OPERATION.ADD } value={ OPERATION.ADD }>
                                <Msg id="misc.smartSearch.survey_submission.addRemoveSelect.add"/>
                            </MenuItem>
                            <MenuItem key={ OPERATION.SUB } value={ OPERATION.SUB }>
                                <Msg id="misc.smartSearch.survey_submission.addRemoveSelect.sub" />
                            </MenuItem>
                        </StyledSelect>
                    ),
                    surveySelect: (
                        <StyledSelect
                            onChange={ e => handleSurveySelectChange(e.target.value) }
                            SelectProps={{ renderValue: function getLabel(value) {
                                return value === DEFAULT_VALUE ?
                                    <Msg id="misc.smartSearch.survey_submission.surveySelect.any" /> :
                                    <Msg
                                        id="misc.smartSearch.survey_submission.surveySelect.survey"
                                        values={{
                                            surveyTitle: surveys.find(s=> s.id === value)?.title }}
                                    />;
                            } }}
                            value={ filter.config.survey || DEFAULT_VALUE }>
                            { !surveys.length && (
                                <MenuItem key={ DEFAULT_VALUE } value={ DEFAULT_VALUE }>
                                    <Msg id="misc.smartSearch.survey_submission.surveySelect.none" />
                                </MenuItem>) }
                            { surveys.map(s => (
                                <MenuItem key={ s.id } value={ s.id }>
                                    { s.title }
                                </MenuItem>
                            )) }
                        </StyledSelect>
                    ),
                    timeFrame: (
                        <TimeFrame
                            filterConfig={{ after: filter.config.after, before: filter.config.before }}
                            onChange={ handleTimeFrameChange }
                            options={ [
                                TIME_FRAME.EVER,
                                TIME_FRAME.AFTER_DATE,
                                TIME_FRAME.BEFORE_DATE,
                                TIME_FRAME.BETWEEN,
                                TIME_FRAME.BEFORE_TODAY,
                                TIME_FRAME.LAST_FEW_DAYS,
                            ] }
                        />
                    ),
                }}
                />
            </Typography>
            <Divider />
            <Typography variant="h6">
                <Msg id="misc.smartSearch.headers.examples"/>
            </Typography>
            <Typography color="textSecondary">
                <Msg id="misc.smartSearch.survey_submission.examples.one"/>
                <br />
                <Msg id="misc.smartSearch.survey_submission.examples.two"/>
            </Typography>

            <Box display="flex" justifyContent="flex-end" m={ 1 } style={{ gap: '1rem' }}>
                <Button color="primary" onClick={ onCancel }>
                    <Msg id="misc.smartSearch.buttonLabels.cancel"/>
                </Button>
                <Button color="primary" disabled={ !submittable } type="submit" variant="contained">
                    { ('id' in filter) ? <Msg id="misc.smartSearch.buttonLabels.edit"/>: <Msg id="misc.smartSearch.buttonLabels.add"/> }
                </Button>
            </Box>
        </form>
    );
};

export default SurveySubmission;
