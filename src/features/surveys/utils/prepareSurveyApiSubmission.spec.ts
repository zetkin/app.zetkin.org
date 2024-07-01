import prepareSurveyApiSubmission from './prepareSurveyApiSubmission';

describe('prepareSurveyApiSubmission()', () => {
  let formData: FormData;

  beforeEach(() => {
    formData = new FormData();
  });

  it('formats a text response', () => {
    formData.set('123.text', 'Lorem ipsum dolor sit amet');
    const submission = prepareSurveyApiSubmission(formData);
    expect(submission.responses).toMatchObject([
      {
        question_id: 123,
        response: 'Lorem ipsum dolor sit amet',
      },
    ]);
  });

  it('formats a radio button response', () => {
    formData.set('123.options', '456');
    const submission = prepareSurveyApiSubmission(formData);
    expect(submission.responses).toMatchObject([
      {
        options: [456],
        question_id: 123,
      },
    ]);
  });

  it('formats a checkbox response', () => {
    formData.set('123.options', '456');
    formData.append('123.options', '789');
    const submission = prepareSurveyApiSubmission(formData);
    expect(submission.responses).toMatchObject([
      {
        options: [456, 789],
        question_id: 123,
      },
    ]);
  });

  it('formats a select widget response', () => {
    formData.set('123.options', '234');
    const submission = prepareSurveyApiSubmission(formData);
    expect(submission.responses).toMatchObject([
      {
        options: [234],
        question_id: 123,
      },
    ]);
  });

  it('formats empty select response', () => {
    formData.set('123.options', '');
    const submission = prepareSurveyApiSubmission(formData);
    expect(submission.responses).toMatchObject([
      {
        options: [],
        question_id: 123,
      },
    ]);
  });

  it('signs as the logged-in account when a logged-in user requests to sign as themself', () => {
    formData.set('sig', 'user');
    const submission = prepareSurveyApiSubmission(formData, true);
    expect(submission.signature).toEqual('user');
  });

  it('signs with custom contact details when a name and email are given', () => {
    formData.set('sig', 'email');
    formData.set('sig.email', 'testuser@example.org');
    formData.set('sig.first_name', 'test');
    formData.set('sig.last_name', 'user');
    const submission = prepareSurveyApiSubmission(formData);
    expect(submission.signature).toMatchObject({
      email: 'testuser@example.org',
      first_name: 'test',
      last_name: 'user',
    });
  });
});
