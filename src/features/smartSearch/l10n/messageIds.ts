import { ReactElement } from 'react';

import { im, m, makeMessages } from 'core/i18n';

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
    campaignActivity: m('Campaign activity'),
    misc: m('Misc'),
    peopleDatabase: m('People'),
    phoneBanking: m('Phone banking'),
    surveys: m('Surveys'),
  },
  filterTitles: {
    all: m('Everyone'),
    call_history: m('Based on their call history'),
    campaign_participation: m('Based on their campaign participation'),
    most_active: m('The most active people'),
    person_data: m('Based on their name, address or other data'),
    person_field: m('Based on custom fields'),
    person_tags: m('Based on their tags'),
    person_view: m('People from a view'),
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
      inputString: im<{ startWithSelect: ReactElement }>(
        'Start with {startWithSelect}.'
      ),
      startWithSelect: {
        false: m('an empty list'),
        true: m('a list of all the people in the organization'),
      },
    },
    callHistory: {
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Remove'),
      },
      assignmentSelect: {
        any: m('any assignment'),
        assignment: im<{ assignmentTitle: string }>(
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
          "Remove people who have been called at least 1 time in assignment 'Campaign 2020' during the last 30 days."
        ),
      },
      inputString: im<{
        addRemoveSelect: ReactElement;
        assignmentSelect: ReactElement;
        callSelect: ReactElement;
        minTimes: number;
        minTimesInput: ReactElement | number;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} people who {callSelect} at least {minTimesInput} {minTimes, plural, one {time} other {times}} in {assignmentSelect} {timeFrame}.'
      ),
    },
    campaignParticipation: {
      activitySelect: {
        activity: im<{ activity: string }>('activity "{activity}"'),
        any: m('any activity'),
      },
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Remove'),
      },
      bookedSelect: {
        booked: m('been booked'),
        signed_up: m('signed up'),
      },
      campaignSelect: {
        any: m('any campaign'),
        campaign: im<{ campaign: string }>('campaign "{campaign}"'),
      },
      examples: {
        one: m(
          "Add people who have signed up for events in any campaign with any activity at location 'Dorfplatz' at any point in time"
        ),
        two: m(
          "Remove people who have not been booked for events in any campaign with activity 'Put up posters' at any location before today."
        ),
      },
      haveSelect: {
        in: m('have'),
        notin: m('have not'),
      },
      inputString: im<{
        activitySelect: ReactElement;
        addRemoveSelect: ReactElement;
        bookedSelect: ReactElement;
        campaignSelect: ReactElement;
        haveSelect: ReactElement;
        locationSelect: ReactElement;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} people who {haveSelect} {bookedSelect} for events in {campaignSelect} with {activitySelect} at {locationSelect} {timeFrame}'
      ),
      locationSelect: {
        any: m('any location'),
        location: im<{ location: string }>('location "{location}"'),
      },
    },
    mostActive: {
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Remove'),
      },
      examples: {
        one: m(
          'Add the 100 most active members of the organization before today.'
        ),
        two: m(
          'Remove the 5 most active members of the organization at any point in time.'
        ),
      },
      inputString: im<{
        addRemoveSelect: ReactElement;
        numPeople: number;
        numPeopleSelect: ReactElement | number;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} the {numPeopleSelect} most active {numPeople, plural, one {person} other {people}} in the organization {timeFrame}.'
      ),
    },
    personData: {
      addRemoveSelect: {
        add: m('Add'),
        sub: m('remove'),
      },
      ellipsis: m('...'),
      examples: {
        one: m(
          "Add any person whose first name is 'Clara' and whose last name is 'Zetkin'."
        ),
        two: m('Remove any person whose city is Stockholm.'),
      },
      fieldMatches: im<{ field: ReactElement; value: ReactElement | string }>(
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
      fieldTuple: im<{ first: ReactElement; second: ReactElement }>(
        '{first} and {second}'
      ),
      inputString: im<{
        addRemoveSelect: ReactElement;
        criteria: ReactElement | string | null;
      }>('{addRemoveSelect} any person whose {criteria}.'),
    },
    personField: {
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Remove'),
      },
      edit: {
        date: im<{ fieldSelect: ReactElement; timeFrame: ReactElement }>(
          '{fieldSelect} is {timeFrame}'
        ),
        none: m("This organization doesn't have any custom fields yet."),
        text: im<{ fieldSelect: ReactElement; freeTextInput: ReactElement }>(
          '{fieldSelect} matches {freeTextInput}'
        ),
        url: im<{ fieldSelect: ReactElement; freeTextInput: ReactElement }>(
          '{fieldSelect} matches {freeTextInput}'
        ),
      },
      fieldSelect: {
        any: m('custom field'),
      },
      inputString: im<{ addRemoveSelect: ReactElement; field: ReactElement }>(
        '{addRemoveSelect} any person whose {field}.'
      ),
      preview: {
        date: im<{ fieldName: string; timeFrame: ReactElement }>(
          '{fieldName} is {timeFrame}'
        ),
        text: im<{ fieldName: string; searchTerm: string }>(
          '{fieldName} matches {searchTerm}'
        ),
        url: im<{ fieldName: string; searchTerm: string }>(
          '{fieldName} matches {searchTerm}'
        ),
      },
    },
    personTags: {
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Remove'),
      },
      condition: {
        conditionSelect: {
          all: m('all'),
          any: m('any'),
          minMatching: m('at least'),
          none: m('none'),
        },
        edit: {
          all: im<{ conditionSelect: ReactElement }>('{conditionSelect}'),
          any: im<{ conditionSelect: ReactElement }>('{conditionSelect}'),
          minMatching: im<{
            conditionSelect: ReactElement;
            minMatchingInput: ReactElement;
          }>('{conditionSelect} {minMatchingInput}'),
          none: im<{ conditionSelect: ReactElement }>('{conditionSelect}'),
        },
        preview: {
          all: m('all'),
          any: m('any'),
          minMatching: im<{ minMatching: number }>('at least {minMatching}'),
          none: m('none'),
        },
      },
      examples: {
        one: m(
          "Add people with at least one of the following tags: 'Member', 'Activist'"
        ),
        two: m("Remove people with all of the following tags: 'Board member'"),
      },
      inputString: im<{
        addRemoveSelect: ReactElement;
        condition: ReactElement;
        tags: ReactElement;
      }>(
        '{addRemoveSelect} people with {condition} of the following tags: {tags}'
      ),
    },
    personView: {
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Remove'),
      },
      examples: {
        one: m('Add people who are in the view "Campaign 2020.'),
        two: m('Remove people who are not in the view "Campaign 2020".'),
      },
      inSelect: {
        in: m('in'),
        notin: m('not in'),
      },
      inputString: im<{
        addRemoveSelect: ReactElement;
        inSelect: ReactElement;
        viewSelect: ReactElement | string;
      }>('{addRemoveSelect} people who are {inSelect} the view {viewSelect}.'),
      viewSelect: {
        none: m("This organization doesn't have any views yet"),
      },
    },
    random: {
      addRemoveSelect: {
        add: m('add'),
        sub: m('remove'),
      },
      examples: {
        one: m('Randomly add 20 people in the organization.'),
        two: m('Randomly remove 15% of the people in the organization.'),
      },
      inputString: im<{
        addRemoveSelect: ReactElement;
        quantity: ReactElement;
      }>('Randomly {addRemoveSelect} {quantity} in the organization.'),
    },
    subQuery: {
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Sub'),
      },
      examples: {
        one: m(
          "Remove people who match Smart Search Query 'People who live in Stockholm'."
        ),
        two: m(
          "Add people who match the target group of call Assignment 'Assignment one'."
        ),
      },
      inputString: im<{
        addRemoveSelect: ReactElement;
        matchSelect: ReactElement;
        query: ReactElement;
      }>('{addRemoveSelect} people who {matchSelect} {query}.'),
      matchSelect: {
        in: m('match'),
        notin: m('do not match'),
      },
      query: {
        edit: {
          callassignment_goal: im<{
            querySelect: ReactElement;
            titleSelect: ReactElement;
          }>('{querySelect} of call assignment "{titleSelect}"'),
          callassignment_target: im<{
            querySelect: ReactElement;
            titleSelect: ReactElement;
          }>('{querySelect} of call assignment "{titleSelect}"'),
          none: im<{ querySelect: ReactElement; titleSelect: ReactElement }>(
            '{querySelect}'
          ),
          standalone: im<{
            querySelect: ReactElement;
            titleSelect: ReactElement;
          }>('{querySelect} "{titleSelect}"'),
        },
        preview: {
          callassignment_goal: im<{ queryTitle: string }>(
            'the purpose group of call assignment "{queryTitle}"'
          ),
          callassignment_target: im<{ queryTitle: string }>(
            'the target group of call assignment "{queryTitle}"'
          ),
          none: im<{ queryTitle: string }>('{queryTitle}'),
          standalone: im<{ queryTitle: string }>(
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
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Remove'),
      },
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
      inputString: im<{
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
        question: im<{ question: string }>('question "{question}"'),
      },
      surveySelect: {
        any: m('a survey'),
        none: m('This organization has no surveys yet'),
        survey: im<{ surveyTitle: string }>('survey "{surveyTitle}"'),
      },
    },
    surveyResponse: {
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Remove'),
      },
      examples: {
        one: m(
          "People whose responses to survey 'Member survey' (any question) include 'organize'."
        ),
        two: m(
          "People whose responses to survey 'Member survey' (question 'Question one') exactly match 'organize'."
        ),
      },
      inputString: im<{
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
        question: im<{ question: string }>('question "{question}"'),
      },
      surveySelect: {
        any: m('a survey'),
        none: m('This organization has no surveys yet'),
        survey: im<{ surveyTitle: string }>('survey "{surveyTitle}"'),
      },
    },
    surveySubmission: {
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Remove'),
      },
      examples: {
        one: m(
          "People who have submitted responses to survey 'Member survey 2020' before today."
        ),
        two: m(
          "People who have submitted responses to survey 'Member survey' during the last 30 days."
        ),
      },
      inputString: im<{
        addRemoveSelect: ReactElement;
        surveySelect: ReactElement;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} people who have submitted responses to {surveySelect} {timeFrame}.'
      ),
      surveySelect: {
        any: m('a survey'),
        none: m('This organization has no surveys yet'),
        survey: im<{ surveyTitle: string }>('survey "{surveyTitle}"'),
      },
    },
    task: {
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Remove'),
      },
      campaignSelect: {
        any: m('any campaign'),
        campaign: im<{ campaign: string }>('campaign "{campaign}"'),
        in: m(' in '),
      },
      examples: {
        one: m(
          'Add people who have completed task "Tell your friends" at least once at any point in time'
        ),
        two: m(
          'Add people who have ignored any task in any campaign between 2 and 5 times before today'
        ),
      },
      inputString: im<{
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
        task: im<{ task: string }>('task "{task}"'),
      },
      taskStatusSelect: {
        assigned: m('been assigned'),
        completed: m('completed'),
        ignored: m('ignored'),
      },
    },
    user: {
      addRemoveSelect: {
        add: m('Add'),
        sub: m('Remove'),
      },
      connectedSelect: {
        false: m('not connected'),
        true: m('connected'),
      },
      examples: {
        one: m('Remove all people who are connected to a Zetkin user.'),
        two: m('Add all people who are not connected to a Zetkin user.'),
      },
      inputString: im<{
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
      between: im<{
        matchingSelect: ReactElement;
        maxInput: ReactElement;
        minInput: ReactElement;
      }>('{matchingSelect} {minInput} and {maxInput} times'),
      max: im<{
        matchingSelect: ReactElement;
        max: number;
        maxInput: ReactElement;
      }>('{matchingSelect} {maxInput} {max, plural, one {time} other {times}}'),
      min: im<{
        matchingSelect: ReactElement;
        min: number;
        minInput: ReactElement;
      }>('{matchingSelect} {minInput} {min, plural, one {time} other {times}}'),
      once: im<{ matchingSelect: ReactElement }>('{matchingSelect}'),
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
      between: im<{ max: number; min: number }>(
        'between {min} and {max} times'
      ),
      max: im<{ max: number; min: number }>(
        'at most {max} {max, plural, one {time} other {times}}'
      ),
      min: im<{ max: number; min: number }>(
        'at least {min} {max, plural, one {time} other {times}}'
      ),
      once: im<{ max: number; min: number }>('at least once'),
    },
  },
  misc: {
    noOptions: m('No matching tags'),
  },
  quantity: {
    edit: {
      integer: im<{ numInput: ReactElement; quantitySelect: ReactElement }>(
        '{numInput} {quantitySelect}'
      ),
      percent: im<{ numInput: ReactElement; quantitySelect: ReactElement }>(
        '{numInput} {quantitySelect}'
      ),
    },
    preview: {
      integer: im<{ people: number }>(
        '{people} {people, plural, one {person} other {people}}'
      ),
      percent: im<{ people: number }>('{people} % of the people'),
    },
    quantitySelectLabel: {
      integer: im<{ people: number }>(
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
  timeFrame: {
    edit: {
      afterDate: im<{
        afterDateSelect: ReactElement;
        timeFrameSelect: ReactElement;
      }>('{timeFrameSelect} {afterDateSelect}'),
      beforeDate: im<{
        beforeDateSelect: ReactElement;
        timeFrameSelect: ReactElement;
      }>('{timeFrameSelect} {beforeDateSelect}'),
      beforeToday: im<{ timeFrameSelect: ReactElement }>('{timeFrameSelect}'),
      between: im<{
        afterDateSelect: ReactElement;
        beforeDateSelect: ReactElement;
        timeFrameSelect: ReactElement;
      }>('{timeFrameSelect} {afterDateSelect} and {beforeDateSelect}'),
      ever: im<{
        timeFrameSelect: ReactElement;
      }>('{timeFrameSelect}'),
      future: im<{ timeFrameSelect: ReactElement }>('{timeFrameSelect}'),
      lastFew: im<{
        days: number;
        daysInput: ReactElement;
        timeFrameSelect: ReactElement;
      }>(
        '{timeFrameSelect} {daysInput} {days, plural, one {day} other {days}}'
      ),
    },
    preview: {
      afterDate: im<{ afterDate: string }>('after {afterDate}'),
      beforeDate: im<{ beforeDate: string }>('before {beforeDate}'),
      beforeToday: im('before today'),
      between: im<{ afterDate: string; beforeDate: string }>(
        'between {afterDate} and {beforeDate}'
      ),
      ever: im('at any point in time'),
      future: im('in the future'),
      lastFew: im<{ days: number }>(
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
