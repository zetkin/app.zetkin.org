'use client';

import { useCallback, useMemo, useRef } from 'react';

const surveyCacheDebounceDuration = 500;
const surveyCacheKey = 'zetkin-survey-cache';

export type SurveySubmissionData = Record<string, string | string[]>;

const loadSurveyCache = (): Record<number, SurveySubmissionData> => {
  if (typeof localStorage === 'undefined') {
    return {};
  }

  const surveyCacheStr = localStorage.getItem(surveyCacheKey);
  if (!surveyCacheStr) {
    return {};
  }

  try {
    return JSON.parse(surveyCacheStr) ?? {};
  } catch (_) {
    return {};
  }
};

const updateSurveyCache = (
  surveyId: number,
  newState: SurveySubmissionData | null
) => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const surveyCacheStr = localStorage.getItem(surveyCacheKey) ?? '{}';
  const surveyCache = JSON.parse(surveyCacheStr) as Record<
    number,
    SurveySubmissionData
  >;
  if (!newState) {
    delete surveyCache[surveyId];
  } else {
    surveyCache[surveyId] = newState;
  }
  localStorage.setItem(surveyCacheKey, JSON.stringify(surveyCache));
};

export const useSurveyFormState = (surveyId: number) => {
  const debounceTimeoutRef = useRef<number | null>(null);

  const initialSurvey = useMemo(() => {
    return loadSurveyCache()[surveyId];
  }, [surveyId]);

  const setSurveyState = useCallback(
    (newState: SurveySubmissionData | null, immediate?: boolean) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (immediate) {
        updateSurveyCache(surveyId, newState);
        return;
      }

      debounceTimeoutRef.current = window.setTimeout(() => {
        debounceTimeoutRef.current = null;
        updateSurveyCache(surveyId, newState);
      }, surveyCacheDebounceDuration);
    },
    [surveyId]
  );

  return [initialSurvey, setSurveyState] as const;
};
