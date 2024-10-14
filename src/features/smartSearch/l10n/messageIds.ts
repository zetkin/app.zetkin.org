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
  filterGallery: {
    categories: {
      basicInformation: {
        description: m('Select based on personal information'),
        title: m('Basic information'),
      },
      crossReferencing: {
        description: m('Select based on lists and smart searches'),
        title: m('Cross referencing'),
      },
      email: {
        description: m(
          'Find people based on the data gathered by sending emails.'
        ),
        title: m('Emails'),
      },
      events: {
        description: m('Select based on data from events'),
        title: m('Events'),
      },
      journey: {
        description: m('Select based on data from journeys'),
        title: m('Journeys'),
      },
      misc: {
        description: m('Miscellaneous ways of selecting'),
        title: m('Misc'),
      },
      phoneBanking: {
        description: m('Use call data to select'),
        title: m('Call assignments'),
      },
      surveys: {
        description: m('Select based on survey submissions'),
        title: m('Surveys'),
      },
      tasks: {
        description: m('Select on task data'),
        title: m('Tasks'),
      },
    },
    filters: {
      call_history: {
        description: m('Find people who were called, reached or tried.'),
        title: m('Call history'),
      },
      campaign_participation: {
        description: m("Who signed up? Got booked? Who didn't? Find them!"),
        title: m('Participation in events'),
      },
      email_blacklist: {
        description: m(
          'Bounced, incorrect address, not received - here they are.'
        ),
        title: m('People who are blocked from emails'),
      },
      email_click: {
        description: m('Did they click? Did they not?'),
        title: m('Based on their interaction with links in emails.'),
      },
      email_history: {
        description: m('Who was sent what, when?'),
        title: m('Based on their email history'),
      },
      journey_subjects: {
        description: m(
          'Find people who are on a journey or finished it already'
        ),
        title: m('People on a journey'),
      },
      person_data: {
        description: m('Name, address, email and more!'),
        title: m('Personal info'),
      },
      person_field: {
        description: m(
          'Like basic personal info, but search fields that are custom to this organization.'
        ),
        title: m('Custom fields'),
      },
      person_tags: {
        description: m('For finding people with or without specific tags.'),
        title: m('Tags'),
      },
      person_view: {
        description: m("When you want people who are, or aren't, in a list."),
        title: m('People from a list'),
      },
      random: {
        description: m('Randomly add or remove people.'),
        title: m('Random selection'),
      },
      sub_query: {
        description: m(
          'Use a another Smart Search to refine this Smart Search.'
        ),
        title: m('People who match a saved Smart Search query'),
      },
      survey_option: {
        description: m(
          'Use your survey responses for their glorious purpose: finding the right people!'
        ),
        title: m('Responses to checkbox questions'),
      },
      survey_response: {
        description: m(
          'Use your survey responses for their glorious purpose: finding the right people!'
        ),
        title: m('Responses to text questions'),
      },
      survey_submission: {
        description: m(
          'Did they submit a survey? Did they not? Find them here!'
        ),
        title: m('Submitted survey'),
      },
      task: {
        description: m(
          'Add or remove people based on their participation in tasks'
        ),
        title: m('Tasks'),
      },
      user: {
        description: m(
          "Find people who are, or aren't, connected to a Zetkin account"
        ),
        title: m('Zetkin users'),
      },
    },
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
        notreached: m('have not been reached'),
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
        minTimes: ReactElement | number | null;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} people who {callSelect} {minTimes} in {assignmentSelect} {timeFrame}.'
      ),
      minTimes: m<{ minTimes: number }>(
        '{minTimes, plural, one {once} other {# times}}'
      ),
      minTimesInput: m<{
        input: ReactElement;
        minTimes: number;
      }>('at least {input} {minTimes, plural, one {time} other {times}}'),
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
    emailBlacklist: {
      inputString: m<{
        addRemoveSelect: ReactElement;
        reasonSelect: ReactElement;
      }>(
        '{addRemoveSelect} people who will not receive email because {reasonSelect}'
      ),
      reasonSelect: {
        any: m('of any reason'),
        unsubOrg: m('they have unsubscribed'),
      },
    },
    emailClick: {
      inputString: m<{
        addRemoveSelect: ReactElement;
        emailSelect: ReactElement | null;
        linkScopeSelect: ReactElement;
        linkSelect: ReactElement | null;
        operatorSelect: ReactElement;
        projectSelect: ReactElement | null;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} people who have {operatorSelect} {linkScopeSelect} {emailSelect} {projectSelect} {timeFrame} {linkSelect}'
      ),
      linkScopeSelect: {
        anyFollowingLinks: m(
          'any of the following links in the specific email'
        ),
        anyLink: m('any link in any email'),
        anyLinkInEmail: m('any link in the specific email'),
        linkInEmailFromProject: m(
          'any link in any email in the specific project'
        ),
      },
      operatorSelect: {
        clicked: m('clicked'),
        notClicked: m('not clicked'),
      },
    },
    emailHistory: {
      emailScopeSelect: {
        any: m('any email'),
        email: m('the specific email'),
        project: m('any email from project'),
      },
      inputString: m<{
        addRemoveSelect: ReactElement;
        emailScopeSelect: ReactElement;
        emailSelect: ReactElement | null;
        operatorSelect: ReactElement;
        projectSelect: ReactElement | null;
        timeFrame: ReactElement;
      }>(
        '{addRemoveSelect} people who have {operatorSelect} {emailScopeSelect} {emailSelect} {projectSelect} {timeFrame}'
      ),
      operatorSelect: {
        notOpened: m('not opened'),
        notSent: m('not been sent'),
        opened: m('opened'),
        sent: m('been sent'),
      },
    },
    journey: {
      condition: {
        conditionSelect: {
          all: m('and have all'),
          any: m('and have any'),
          none: m('and have none'),
          regardlessTags: m('regardless of tags'),
          some: m('and have at least'),
        },
        preview: {
          all: m('and have all'),
          any: m('and have any'),
          none: m('and have none'),
          regardlessTags: m('regardless of tags'),
          some: m<{ minMatching: number }>('and have at least {minMatching}'),
        },
      },
      followingTags: m('of the following tags'),
      inputString: m<{
        addRemoveSelect: ReactElement;
        closedTimeFrame: ReactElement | null;
        condition: ReactElement;
        journeySelect: ReactElement;
        openedTimeFrame: ReactElement;
        stateSelect: ReactElement;
        tags: ReactElement | null;
        tagsDesc: ReactElement | null;
      }>(
        '{addRemoveSelect} people who are part of {journeySelect} that opened {openedTimeFrame} and {stateSelect} {closedTimeFrame} {condition} {tagsDesc} {tags}'
      ),
      stateOptions: {
        closed: m('closed'),
        open: m('are still open'),
      },
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
      genders: {
        f: m('female'),
        m: m('male'),
        o: m('other'),
        unknown: m('unknown'),
      },
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
          none: m('none'),
          some: m('at least'),
        },
        edit: {
          all: m<{ conditionSelect: ReactElement }>('{conditionSelect}'),
          any: m<{ conditionSelect: ReactElement }>('{conditionSelect}'),
          none: m<{ conditionSelect: ReactElement }>('{conditionSelect}'),
          some: m<{
            conditionSelect: ReactElement;
            minMatchingInput: ReactElement;
          }>('{conditionSelect} {minMatchingInput}'),
        },
        preview: {
          all: m('all'),
          any: m('any'),
          none: m('none'),
          some: m<{ minMatching: number }>('at least {minMatching}'),
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
        some: m('some'),
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
    noOptionsEmailNotSent: m(
      'Email not sent. Links included in the email are added after it has been sent.'
    ),
    noOptionsInvalidEmail: m('Invalid email. Select an email first.'),
    noOptionsLinks: m('No matching links'),
  },
  operators: {
    add: m('Add'),
    limit: m('Limit to'),
    sub: m('Remove'),
  },
  orgScope: {
    all: m('Searching in all organizations'),
    few: m<{ first: string; last: string }>('Searching in {first} and {last}'),
    many: m<{ additional: number; first: string }>(
      'Searching in {first} and {additional} other organizations'
    ),
    single: m<{ value: string }>('Searching in {value}'),
    suborgs: m('Searching in all sub-organizations'),
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
