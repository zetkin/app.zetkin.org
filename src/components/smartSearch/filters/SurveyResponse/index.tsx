/* eslint-disable react-hooks/exhaustive-deps */
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Button, Divider, MenuItem, Typography } from '@material-ui/core';
import { FormEvent, useEffect, useState } from 'react';

import getSurveysWithElements from 'fetching/getSurveysWithElements';
import StyledSelect from '../../inputs/StyledSelect';
import StyledTextInput from 'components/smartSearch/inputs/StyledTextInput';
import useSmartSearchFilter from 'hooks/useSmartSearchFilter';
import {  ELEMENT_TYPE, RESPONSE_TYPE, ZetkinSurveyElement } from 'types/zetkin';
import { MATCH_OPERATORS, NewSmartSearchFilter, OPERATION, SmartSearchFilterWithId, SurveyResponseFilterConfig, ZetkinSmartSearchFilter } from 'types/smartSearch';

const DEFAULT_VALUE = 'none';

interface SurveyResponseProps {
    filter:  SmartSearchFilterWithId<SurveyResponseFilterConfig> |  NewSmartSearchFilter ;
    onSubmit: (filter: SmartSearchFilterWithId<SurveyResponseFilterConfig> | ZetkinSmartSearchFilter<SurveyResponseFilterConfig>) => void;
    onCancel: () => void;
}

const SurveyResponse = ({ onSubmit, onCancel, filter: initialFilter }: SurveyResponseProps): JSX.Element => {
    const { orgId } = useRouter().query;
    const surveysQuery = useQuery(['surveysWithElements', orgId], getSurveysWithElements(orgId as string));
    const surveys = surveysQuery.data || [];
    const [validQuestions, setValidQuestions] = useState<ZetkinSurveyElement[]>([]);
    const { filter, setConfig, setOp } = useSmartSearchFilter<SurveyResponseFilterConfig>(initialFilter);

    const getSurveyIdfromQuestionId = (questionId?: number) => {
        return questionId? surveys.map(s => ({ elements: s.elements.map(e => e.id), id: s.id  })).find(s => s.elements.includes(questionId))?.id : undefined;
    };

    // only submit if there are surveys with valid questions
    const submittable = surveys.length && validQuestions.length;

    useEffect(() => {
        if (surveys.length) {
            setConfig({
                operator: filter.config.operator || MATCH_OPERATORS.IN,
                question: filter.config.question,
                survey: filter.config.survey || getSurveyIdfromQuestionId(filter.config.question) || surveys[0].id,
                value: filter.config.value || '' });
        }
    }, [surveys]);

    useEffect(() => {
        //check whether selected survey has questions of 'text' type
        setValidQuestions(surveys
            .find(s => s.id === filter.config.survey)?.elements
            .filter(e => e.type === ELEMENT_TYPE.QUESTION && e.question.response_type === RESPONSE_TYPE.TEXT) || []);
    }, [filter.config]);


    //event handlers
    const handleAddFilter = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ ...filter, config: {
            ...filter.config,
            survey: filter.config.question ? undefined : filter.config.survey,
        } });
    };

    const handleQuestionSelectChange = (questionValue: string) => {
        if (questionValue === DEFAULT_VALUE) {
            setConfig({ ...filter.config, question: undefined });
        }
        else {
            setConfig({ ...filter.config, question: +questionValue });
        }
    };

    const handleSurveySelectChange = (surveyValue: string) => {
        setConfig({ ...filter.config, question: undefined, survey: +surveyValue });
    };

    const handleMatchSelectChange = (matchValue: string) => {
        setConfig({ ...filter.config, operator: matchValue as MATCH_OPERATORS });
    };

    const handleValueChange = (value: string) => {
        setConfig({ ...filter.config, value: value });
    };


    return (
        <form onSubmit={ e => handleAddFilter(e) }>
            <Typography style={{ lineHeight: 'unset', marginBottom: '2rem' }} variant="h4">
                <Msg id="misc.smartSearch.survey_response.inputString" values={{
                    addRemoveSelect: (
                        <StyledSelect onChange={ e => setOp(e.target.value as OPERATION) }
                            value={ filter.op }>
                            <MenuItem key={ OPERATION.ADD } value={ OPERATION.ADD }>
                                <Msg id="misc.smartSearch.survey_response.addRemoveSelect.add"/>
                            </MenuItem>
                            <MenuItem key={ OPERATION.SUB } value={ OPERATION.SUB }>
                                <Msg id="misc.smartSearch.survey_response.addRemoveSelect.sub" />
                            </MenuItem>
                        </StyledSelect>
                    ),
                    freeTextInput: (
                        <StyledTextInput
                            inputString={ filter.config.value } // dynamic width
                            onChange={ e => handleValueChange(e.target.value) }
                            value={ filter.config.value }
                        />
                    ),
                    matchSelect: (
                        <StyledSelect
                            onChange={ e => handleMatchSelectChange(e.target.value) }
                            value={ filter.config.operator || MATCH_OPERATORS.IN }>
                            { Object.values(MATCH_OPERATORS).map(o => (
                                <MenuItem key={ o } value={ o }>
                                    <Msg id={ `misc.smartSearch.survey_response.matchSelect.${o}` }/>
                                </MenuItem>
                            )) }
                        </StyledSelect>
                    ),
                    questionSelect: (
                        <StyledSelect
                            disabled={ !surveys.length }
                            onChange={ e => handleQuestionSelectChange(e.target.value) }
                            SelectProps={{ renderValue: function getLabel(value) {
                                return value === DEFAULT_VALUE ?
                                    <Msg id="misc.smartSearch.survey_response.questionSelect.any" /> :
                                    <Msg
                                        id="misc.smartSearch.survey_response.questionSelect.question"
                                        values={{
                                            question: validQuestions.find(q=> q.id === value)?.question.question }}
                                    />;
                            } }}
                            value={ filter.config.question || DEFAULT_VALUE }>
                            { !validQuestions.length && (
                                <MenuItem key={ DEFAULT_VALUE } value={ DEFAULT_VALUE }>
                                    <Msg id="misc.smartSearch.survey_response.questionSelect.none" />
                                </MenuItem>) }
                            { validQuestions.length && (
                                <MenuItem key={ DEFAULT_VALUE } value={ DEFAULT_VALUE }>
                                    <Msg id="misc.smartSearch.survey_response.questionSelect.any" />
                                </MenuItem>
                            ) }
                            { validQuestions.map(q => (
                                <MenuItem key={ q.id } value={ q.id }>
                                    { q.question.question }
                                </MenuItem>
                            )) }
                        </StyledSelect>
                    ),
                    surveySelect: (
                        <StyledSelect
                            onChange={ e => handleSurveySelectChange(e.target.value) }
                            SelectProps={{ renderValue: function getLabel(value) {
                                return value === DEFAULT_VALUE ?
                                    <Msg id="misc.smartSearch.survey_response.surveySelect.any" /> :
                                    <Msg
                                        id="misc.smartSearch.survey_response.surveySelect.survey"
                                        values={{
                                            surveyTitle: surveys.find(s=> s.id === value)?.title }}
                                    />;
                            } }}
                            value={ filter.config.survey || DEFAULT_VALUE }>
                            { !surveys.length && (
                                <MenuItem key={ DEFAULT_VALUE } value={ DEFAULT_VALUE }>
                                    <Msg id="misc.smartSearch.survey_response.surveySelect.none" />
                                </MenuItem>) }
                            { surveys.map(s => (
                                <MenuItem key={ s.id } value={ s.id }>
                                    { s.title }
                                </MenuItem>
                            )) }
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
                <Msg id="misc.smartSearch.survey_response.examples.one"/>
                <br />
                <Msg id="misc.smartSearch.survey_response.examples.two"/>
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

export default SurveyResponse;
