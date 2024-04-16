import { ReactElement } from 'react';

import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.smartSearch', {
  buttonLabels: {
    add: m('Save selection'),
    addNewFilter: m('Add / remove people'),
    cancel: m('Cancel'),
    close: m('Close'),
    goBack: m('Go back to query'),
    save: m('Save'),
  },
  filterCategories: {
    campaignActivity: m('Project activity'),
    journey: m('Journey'),
    misc: m('Misc'),
    peopleDatabase: m('People'),
    phoneBanking: m('Phone banking'),
    surveys: m('Surveys'),
  },
  filterTitles: {
    all: m('Everyone'),
    call_blocked: m('Blocked from calling'),
    call_history: m('Based on their call history'),
    campaign_participation: m('Based on their event participation'),
    journey: m('Based on journeys'),
    most_active: m('The most active people'),
    person_data: m('Based on their name, address or other data'),
    person_field: m('Based on custom fields'),
    person_tags: m('Based on their tags'),
    person_view: m('People from a list'),
    random: m('A random selection of people'),
    sub_query: m('Based on another Smart Search query'),
    survey_option: m(
      'Based on the options they have selected in survey questions'
    ),
    survey_response: m('Based on their responses to survey questions'),
    survey_submission: m('People who have submitted a survey'),
    task: m('People who have engaged in tasks'),
    user: m('People who used Zetkin'),
  },
  filters: {
    all: {
      inputString: m<{ startWithSelect: ReactElement }>(
        'Start with {startWithSelect}.'
      ),
      startWithSelect: {
        false: m('an empty list'),
        true: m('a list of all the people in the organization'),
      },
    },
    callBlocked: {
      inputString: m<{ addRemoveSelect: ReactElement }>(
        '{addRemoveSelect} people who are blocked from calling for any reason'
      ),
    },
    callHistory: {
      assignmentSelect: {
        any: m('any assignment'),
        assignment: m<{ assignmentTitle: ReactElement | string }>(
          'assignment "{assignmentTitle}"'
        ),
        none: m("This organization doesn't have any call assignments yet"),
      },
      callSelect: {
        called: m('have been called'),
        notreached: m('have been unsuccessfully tried'),
        reached: m('have been successfully reached'),
      },
      examples: {
        one: m(
          'Add people who have been successfully reached at least 2 times in any assignment at any point in time.'
        ),
        two: m(
          "Remove people who have been called at least 1 time in assignment 'Activate old members' during the last 30 days."
        ),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        assignmentSelect: ReactElement;
        callSelect: ReactElement;
        minTimes: ReactElement | number;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} people who {callSelect} at least {minTimes} in {assignmentSelect} {timeFrame}.'
      ),
      minTimes: m<{ minTimes: number }>(
        '{minTimes, plural, one {once} other {# times}}'
      ),
      minTimesInput: m<{
        input: ReactElement;
        minTimes: number;
      }>('{input} {minTimes, plural, one {time} other {times}}'),
    },
    campaignParticipation: {
      activitySelect: {
        activity: m<{ activity: ReactElement | string }>('type "{activity}"'),
        any: m('any type'),
      },
      bookedSelect: {
        booked: m('been booked'),
        signed_up: m('signed up'),
      },
      campaignSelect: {
        any: m('any project'),
        campaign: m<{ campaign: ReactElement | string }>(
          'project "{campaign}"'
        ),
      },
      examples: {
        one: m(
          "Add people who have signed up for events in any project of any type at location 'Dorfplatz' at any point in time"
        ),
        two: m(
          "Remove people who have not been booked for events in any project of type 'Put up posters' at any location before today."
        ),
      },
      haveSelect: {
        in: m('have'),
        notin: m('have not'),
      },
      inputString: m<{
        activitySelect: ReactElement;
        addRemoveSelect: ReactElement;
        bookedSelect: ReactElement;
        campaignSelect: ReactElement;
        haveSelect: ReactElement;
        locationSelect: ReactElement;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} people who {haveSelect} {bookedSelect} for events in {campaignSelect} of {activitySelect} at {locationSelect} {timeFrame}'
      ),
      locationSelect: {
        any: m('any location'),
        location: m<{ location: ReactElement | string }>(
          'location "{location}"'
        ),
      },
    },
    journey: {
      closed: m('a closed'),
      inputString: m<{
        addRemoveSelect: ReactElement;
        journeySelect: ReactElement;
        operator: ReactElement;
        statusText: ReactElement;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} people who are part of {operator} {journeySelect} {statusText} {timeFrame}'
      ),
      opened: m('an open'),
      thatFinished: m('that finished'),
      thatOpened: m('that opened'),
    },
    mostActive: {
      examples: {
        one: m(
          'Add the 100 most active members of the organization before today.'
        ),
        two: m(
          'Remove the 5 most active members of the organization at any point in time.'
        ),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        numPeople: ReactElement | number;
        numPeopleSelect: ReactElement | number;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} the {numPeopleSelect} most active {numPeople} in the organization {timeFrame}.'
      ),
      numPeople: m<{
        numPeople: number;
      }>('{numPeople, plural, one {person} other {people}}'),
      numPeopleSelect:
        m<{ numPeopleSelect: ReactElement | number }>('{numPeopleSelect}'),
    },
    personData: {
      ellipsis: m('...'),
      examples: {
        one: m(
          "Add any person whose first name is 'Clara' and whose last name is 'Zetkin'."
        ),
        two: m('Remove any person whose city is Stockholm.'),
      },
      fieldMatches: m<{ field: ReactElement; value: ReactElement | string }>(
        '{field} matches {value}'
      ),
      fieldSelect: {
        alt_phone: m('alternative phone number'),
        city: m('city'),
        co_address: m('co-address'),
        email: m('email'),
        first_name: m('first name'),
        gender: m('gender'),
        last_name: m('last name'),
        phone: m('phone number'),
        remove: m('Remove this criteria'),
        street_address: m('street address'),
        zip_code: m('zip code'),
      },
      fieldTuple: m<{ first: ReactElement; second: ReactElement }>(
        '{first} and {second}'
      ),
      inputString: m<{
        addRemoveSelect: ReactElement;
        criteria: ReactElement | string | null;
      }>('{addRemoveSelect} any person whose {criteria}.'),
    },
    personField: {
      edit: {
        date: m<{ fieldSelect: ReactElement; timeFrame: ReactElement }>(
          '{fieldSelect} is {timeFrame}'
        ),
        none: m("This organization doesn't have any custom fields yet."),
        text: m<{ fieldSelect: ReactElement; freeTextInput: ReactElement }>(
          '{fieldSelect} matches "{freeTextInput}"'
        ),
        url: m<{ fieldSelect: ReactElement; freeTextInput: ReactElement }>(
          '{fieldSelect} matches "{freeTextInput}"'
        ),
      },
      fieldSelect: {
        any: m('custom field'),
      },
      inputString: m<{ addRemoveSelect: ReactElement; field: ReactElement }>(
        '{addRemoveSelect} any person whose {field}.'
      ),
      preview: {
        date: m<{ fieldName: ReactElement | string; timeFrame: ReactElement }>(
          '{fieldName} is {timeFrame}'
        ),
        text: m<{
          fieldName: ReactElement | string;
          searchTerm: ReactElement | string;
        }>('{fieldName} matches "{searchTerm}"'),
        url: m<{
          fieldName: ReactElement | string;
          searchTerm: ReactElement | string;
        }>('{fieldName} matches "{searchTerm}"'),
      },
    },
    personTags: {
      condition: {
        conditionSelect: {
          all: m('all'),
          any: m('any'),
          minMatching: m('at least'),
          none: m('none'),
        },
        edit: {
          all: m<{ conditionSelect: ReactElement }>('{conditionSelect}'),
          any: m<{ conditionSelect: ReactElement }>('{conditionSelect}'),
          minMatching: m<{
            conditionSelect: ReactElement;
            minMatchingInput: ReactElement;
          }>('{conditionSelect} {minMatchingInput}'),
          none: m<{ conditionSelect: ReactElement }>('{conditionSelect}'),
        },
        preview: {
          all: m('all'),
          any: m('any'),
          minMatching: m<{ minMatching: number }>('at least {minMatching}'),
          none: m('none'),
        },
      },
      examples: {
        one: m(
          "Add people with at least one of the following tags: 'Member', 'Activist'"
        ),
        two: m("Remove people with all of the following tags: 'Board member'"),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        condition: ReactElement;
        tags: ReactElement;
      }>(
        '{addRemoveSelect} people with {condition} of the following tags: {tags}'
      ),
    },
    personView: {
      examples: {
        one: m('Add people who are in the list "Active Members 2022".'),
        two: m('Remove people who are not in the list "Active Members 2022".'),
      },
      inSelect: {
        in: m('in'),
        notin: m('not in'),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        inSelect: ReactElement;
        viewSelect: ReactElement | string;
      }>('{addRemoveSelect} people who are {inSelect} the list {viewSelect}.'),
      viewSelect: {
        none: m("This organization doesn't have any lists yet"),
      },
    },
    random: {
      addLimitRemoveSelect: {
        add: m('add'),
        limit: m('limit to'),
        sub: m('remove'),
      },
      examples: {
        one: m('Randomly add 20 people in the organization.'),
        two: m('Randomly remove 15% of the people in the organization.'),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        quantity: ReactElement;
      }>('Randomly {addRemoveSelect} {quantity} in the organization.'),
    },
    subQuery: {
      examples: {
        one: m(
          "Remove people who match Smart Search Query 'People who live in Stockholm'."
        ),
        two: m(
          "Add people who match the target group of call assignment 'Assignment one'."
        ),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        matchSelect: ReactElement;
        query: ReactElement;
      }>('{addRemoveSelect} people who {matchSelect} {query}.'),
      matchSelect: {
        in: m('match'),
        notin: m('do not match'),
      },
      noSmartSearches: m(
        'There are no Smart Searches in this organisation yet.'
      ),
      query: {
        edit: {
          callassignment_goal: m<{
            querySelect: ReactElement;
            titleSelect: ReactElement;
          }>('{querySelect} of call assignment "{titleSelect}"'),
          callassignment_target: m<{
            querySelect: ReactElement;
            titleSelect: ReactElement;
          }>('{querySelect} of call assignment "{titleSelect}"'),
          none: m<{ querySelect: ReactElement; titleSelect: ReactElement }>(
            '{querySelect}'
          ),
          standalone: m<{
            querySelect: ReactElement;
            titleSelect: ReactElement;
          }>('{querySelect} "{titleSelect}"'),
        },
        preview: {
          callassignment_goal: m<{ queryTitle: ReactElement | string }>(
            'the purpose group of call assignment "{queryTitle}"'
          ),
          callassignment_target: m<{ queryTitle: ReactElement | string }>(
            'the target group of call assignment "{queryTitle}"'
          ),
          none: m<{ queryTitle: ReactElement | string }>('{queryTitle}'),
          standalone: m<{ queryTitle: ReactElement | string }>(
            'Smart Search query "{queryTitle}"'
          ),
        },
        selectLabel: {
          callassignment_goal: m('the purpose group'),
          callassignment_target: m('the target group'),
          none: m('a Smart Search query'),
          standalone: m('Smart Search query'),
        },
        selectOptions: {
          callassignment_goal: m('the purpose group of a call assignment'),
          callassignment_target: m('the target group of a call assignment'),
          none: m(
            "This organization doesn't have any call assignments or Smart Search queries yet."
          ),
          standalone: m('a standalone Smart Search query'),
        },
      },
    },
    surveyOption: {
      conditionSelect: {
        all: m('all'),
        any: m('any'),
        none: m('none'),
      },
      examples: {
        one: m(
          "Remove all people who have chosen all of the following options in survey 'Member survey 2020' (question 'Question one'): 'Sometimes', 'Never'"
        ),
        two: m(
          "Add all people who have chosen any of the following options in survey 'Member survey' (question 'Question two'): 'Option two'"
        ),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        conditionSelect: ReactElement;
        options: ReactElement;
        questionSelect: ReactElement;
        surveySelect: ReactElement;
      }>(
        '{addRemoveSelect} people who have chosen {conditionSelect} of the following options in {surveySelect} ({questionSelect}): {options}'
      ),
      questionSelect: {
        any: m('a question'),
        none: m('There are no option questions in this survey'),
        question: m<{ question: ReactElement | string }>(
          'question "{question}"'
        ),
      },
      surveySelect: {
        any: m('a survey'),
        none: m('This organization has no surveys yet'),
        survey: m<{ surveyTitle: ReactElement | string }>(
          'survey "{surveyTitle}"'
        ),
      },
    },
    surveyResponse: {
      examples: {
        one: m(
          "People whose responses to survey 'Member survey' (any question) include 'organize'."
        ),
        two: m(
          "People whose responses to survey 'Member survey' (question 'Question one') exactly match 'organize'."
        ),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        freeTextInput: ReactElement | string;
        matchSelect: ReactElement;
        questionSelect: ReactElement;
        surveySelect: ReactElement;
      }>(
        '{addRemoveSelect} people whose response to {surveySelect} ({questionSelect}) {matchSelect} "{freeTextInput}"'
      ),
      matchSelect: {
        eq: m('exactly matches'),
        in: m('includes'),
        noteq: m('is not'),
        notin: m('does not include'),
      },
      questionSelect: {
        any: m('any question'),
        none: m('There are no free text questions in this survey'),
        question: m<{ question: ReactElement | string }>(
          'question "{question}"'
        ),
      },
      surveySelect: {
        any: m('a survey'),
        none: m('This organization has no surveys yet'),
        survey: m<{ surveyTitle: ReactElement | string }>(
          'survey "{surveyTitle}"'
        ),
      },
    },
    surveySubmission: {
      examples: {
        one: m(
          "People who have submitted responses to survey 'Member survey 2020' before today."
        ),
        two: m(
          "People who have submitted responses to survey 'Member survey 2020' during the last 30 days."
        ),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        surveySelect: ReactElement;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} people who have submitted responses to {surveySelect} {timeFrame}.'
      ),
      surveySelect: {
        any: m('a survey'),
        none: m('This organization has no surveys yet'),
        survey: m<{ surveyTitle: ReactElement | string }>(
          'survey "{surveyTitle}"'
        ),
      },
    },
    task: {
      campaignSelect: {
        any: m('any project'),
        campaign: m<{ campaign: ReactElement | string }>(
          'project "{campaign}"'
        ),
        in: m(' in '),
      },
      examples: {
        one: m(
          'Add people who have completed task "Tell your friends" at least once at any point in time'
        ),
        two: m(
          'Add people who have ignored any task in any project between 2 and 5 times before today'
        ),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        campaignSelect: ReactElement | null;
        matchingSelect: ReactElement;
        taskSelect: ReactElement;
        taskStatusSelect: ReactElement;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} people who have {taskStatusSelect} {taskSelect}{campaignSelect} {matchingSelect} {timeFrame}'
      ),
      taskSelect: {
        any: m('any task'),
        task: m<{ task: ReactElement | string }>('task "{task}"'),
      },
      taskStatusSelect: {
        assigned: m('been assigned'),
        completed: m('completed'),
        ignored: m('ignored'),
      },
    },
    user: {
      connectedSelect: {
        false: m('not connected'),
        true: m('connected'),
      },
      examples: {
        one: m('Remove all people who are connected to a Zetkin user.'),
        two: m('Add all people who are not connected to a Zetkin user.'),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        connectedSelect: ReactElement;
      }>(
        '{addRemoveSelect} all people who are {connectedSelect} to a Zetkin user.'
      ),
    },
  },
  headers: {
    examples: m('Examples'),
    gallery: m('How would you like to select people?'),
  },
  matching: {
    edit: {
      between: m<{
        matchingSelect: ReactElement;
        maxInput: ReactElement;
        minInput: ReactElement;
      }>('{matchingSelect} {minInput} and {maxInput} times'),
      max: m<{
        matchingSelect: ReactElement;
        max: number;
        maxInput: ReactElement;
      }>('{matchingSelect} {maxInput} {max, plural, one {time} other {times}}'),
      min: m<{
        matchingSelect: ReactElement;
        min: number;
        minInput: ReactElement;
      }>('{matchingSelect} {minInput} {min, plural, one {time} other {times}}'),
      once: m<{ matchingSelect: ReactElement }>('{matchingSelect}'),
    },
    labels: {
      between: m('between'),
      max: m('at most'),
      min: m('at least'),
      once: m('at least once'),
    },
    options: {
      between: m('between'),
      max: m('at most'),
      min: m('at least'),
      once: m('at least once'),
    },
    preview: {
      // These messages "fake" a consistent interface in order to make it
      // easier to use them without conditionals in the code. But it would
      // be nicer to refactor any code that uses them so that it's 100%
      // type safe, by creating a new MatchingPreview component or something.
      // TODO: Replace consistent interface with actual interface
      between: m<{ max: number; min: number }>('between {min} and {max} times'),
      max: m<{ max: number; min: number }>(
        'at most {max} {max, plural, one {time} other {times}}'
      ),
      min: m<{ max: number; min: number }>(
        'at least {min} {max, plural, one {time} other {times}}'
      ),
      once: m<{ max: number; min: number }>('at least once'),
    },
  },
  misc: {
    noOptions: m('No matching tags'),
  },
  operators: {
    add: m('Add'),
    limit: m('Limit to'),
    sub: m('Remove'),
  },
  quantity: {
    edit: {
      integer: m<{ numInput: ReactElement; quantitySelect: ReactElement }>(
        '{numInput} {quantitySelect}'
      ),
      percent: m<{ numInput: ReactElement; quantitySelect: ReactElement }>(
        '{numInput} {quantitySelect}'
      ),
    },
    preview: {
      integer: m<{ people: number }>(
        '{people} {people, plural, one {person} other {people}}'
      ),
      percent: m<{ people: number }>('{people} % of the people'),
    },
    quantitySelectLabel: {
      integer: m<{ people: number }>(
        '{people, plural, one {person} other {people}}'
      ),
      percent: m('% of the people'),
    },
    quantitySelectOptions: {
      integer: m('a number of people'),
      percent: m('a percentage of people'),
    },
  },
  readOnly: m(
    'This Smart Search query is in read-only mode and cannot be edited.'
  ),
  resultHint: {
    countLabel: m<{ count: number }>(
      '{count, plural, =1 {one person} other {# people}}'
    ),
    hint: m<{ count: ReactElement }>(
      'This Smart Search will currently return {count} for you.'
    ),
  },
  smartSearch: m('Smart Search'),
  statsPopper: {
    change: m('change'),
    details: m(
      'Smart Search is dynamic. That means that over time, the number of matches can vary. Other users can see different results if they have access to more or less people.'
    ),
    exit: m('Result'),
    headline: m('Selection impact'),
    info: m(
      'This is a dynamic selection and the numbers may change over time.'
    ),
    input: m('before'),
    matches: m('found'),
    output: m('after'),
  },
  timeFrame: {
    edit: {
      afterDate: m<{
        afterDateSelect: ReactElement;
        timeFrameSelect: ReactElement;
      }>('{timeFrameSelect} {afterDateSelect}'),
      beforeDate: m<{
        beforeDateSelect: ReactElement;
        timeFrameSelect: ReactElement;
      }>('{timeFrameSelect} {beforeDateSelect}'),
      beforeToday: m<{ timeFrameSelect: ReactElement }>('{timeFrameSelect}'),
      between: m<{
        afterDateSelect: ReactElement;
        beforeDateSelect: ReactElement;
        timeFrameSelect: ReactElement;
      }>('{timeFrameSelect} {afterDateSelect} and {beforeDateSelect}'),
      ever: m<{
        timeFrameSelect: ReactElement;
      }>('{timeFrameSelect}'),
      future: m<{ timeFrameSelect: ReactElement }>('{timeFrameSelect}'),
      lastFew: m<{
        days: number;
        daysInput: ReactElement;
        timeFrameSelect: ReactElement;
      }>(
        '{timeFrameSelect} {daysInput} {days, plural, one {day} other {days}}'
      ),
    },
    preview: {
      afterDate: m<{ afterDate: string }>('after {afterDate}'),
      beforeDate: m<{ beforeDate: string }>('before {beforeDate}'),
      beforeToday: m('before today'),
      between: m<{ afterDate: string; beforeDate: string }>(
        'between {afterDate} and {beforeDate}'
      ),
      ever: m('at any point in time'),
      future: m('in the future'),
      lastFew: m<{ days: number }>(
        'during the last {days} {days, plural, one {day} other {days}}'
      ),
    },
    timeFrameSelectLabel: {
      afterDate: m('after'),
      beforeDate: m('before'),
      beforeToday: m('before today'),
      between: m('between'),
      ever: m('at any point in time'),
      future: m('in the future'),
      lastFew: m('during the last'),
    },
    timeFrameSelectOptions: {
      afterDate: m('after a certain date'),
      beforeDate: m('before a certain date'),
      beforeToday: m('before today'),
      between: m('between two dates'),
      ever: m('at any point in time'),
      future: m('in the future'),
      lastFew: m('recently'),
    },
  },
});
