import React, { Component } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert2';
import { Spin, Alert, Modal } from 'antd';

// Styles
import Header from '../../common/Header';
import Button from '../../common/Button';
import { Container, SpinWrapper, SkipButtonsDiv, Form } from './Survey.style';

// Actions
import {
  fetchSurveyData,
  checkPINResponses,
  submitSurvey,
  getParticipantByPIN,
} from '../../../actions/surveyAction';

// Components
import ConfirmSurvey from './ConfirmSurvey';
import EnterPIN from './EnterPIN';
import SurveyQs from './SurveyQs';

// Helpers
import { validPIN, validPostcode } from '../../../helpers/surveyValidation';

class Survey extends Component {
  state = {
    surveyParts: '',
    PIN: '',
    disagreedToResearch: false,
    PINerror: '',
    formState: {},
    PINvalid: false,
    section: 'confirmSurvey',
    completionRate: 0,
    postcodeValid: false,
  };

  componentDidMount() {
    const { location, fetchSurveyData: fetchSurveyDataAction } = this.props;
    const survey = `${location.pathname}`;
    const surveyParts = survey.split('/')[2];
    // gets survey data
    fetchSurveyDataAction(surveyParts);
    this.setState({ surveyParts });
  }

  // enables user to change direction of sections
  sectionChange = (direction, uniqueGroups) => {
    let newSection;
    const { section } = this.state;

    if (direction === 'forward') {
      switch (section) {
        // first section
        case 'confirmSurvey':
          newSection = 'enterPIN';
          break;
        // second section
        case 'enterPIN':
          newSection = uniqueGroups[0];
          break;
        // survey questions start
        // demographic is always 0
        // pre day 1, pre special
        case 'demographic':
          newSection = 'Behavioural Insights';
          break;
        // post day 1, post day 2
        case 'Behavioural Insights':
          if (uniqueGroups[1] === 'about your trainer') {
            newSection = 'about your trainer';
            // post day 3, post-special
          }
          break;
        default:
          newSection = section;
      }
      // backward direction
    } else {
      switch (section) {
        case 'enterPIN':
          newSection = 'confirmSurvey';
          break;
        case 'demographic':
          newSection = 'enterPIN';
          break;
        case 'Behavioural Insights':
          if (uniqueGroups[0] === 'Behavioural Insights') {
            newSection = 'enterPIN';
          } else {
            newSection = 'demographic';
          }
          break;
        case 'about your trainer':
          newSection = 'Behavioural Insights';
          break;
        case 'about your usual way of teaching':
          newSection = 'enterPIN';
          break;
        default:
          newSection = section;
      }
    }
    this.setState({ section: newSection });
  };

  // renders back and next button and calls next/submit actions
  renderSkipButtons = (section, disabled, uniqueGroups, completionRate) => {
    const { PIN, surveyParts } = this.state;
    return (
      <SkipButtonsDiv>
        <Button
          label="Back"
          width="100px"
          height="50px"
          type="primary"
          onClick={() => {
            window.scrollTo(0, 0);
            this.sectionChange('back', uniqueGroups);
          }}
        />
        {(!completionRate || completionRate < 100) && (
          <Button
            label="Next"
            width="100px"
            height="50px"
            type="primary"
            disabled={disabled}
            onClick={() => {
              window.scrollTo(0, 0);
              this.sectionChange('forward', uniqueGroups);
              if (section === 'enterPIN') {
                this.submitPIN(PIN, surveyParts);
              }
            }}
          />
        )}
      </SkipButtonsDiv>
    );
  };

  // renders research confirmation popup
  researchConfirm = () =>
    swal
      .fire({
        title: 'Research Cooperation <br>(University of Manchester)',
        type: 'info',
        text:
          'Many thanks for agreeing to fill in this form. Your responses will be collated by University of Manchester to evaluate Connect5. University of Manchester will use anonymised data collected for research purposes. Individuals will never been identified by their responses. If you do not consent for your data to be used for research purposes, please tick.',
        input: 'checkbox',
        inputPlaceholder: '<strong>I do not agree</strong>',
      })
      .then(result => {
        if (result.value) {
          swal
            .fire({
              type: 'error',
              text:
                'Thank you, your data will not be used for research purposes',
            })
            .then(() => this.setState({ disagreedToResearch: true }));
          // do something here
        } else if (result.value === 0) {
          swal.fire({ type: 'success', text: 'Thank you!' });
        } else {
          console.log(`modal was dismissed by ${result.dismiss}`);
        }
      });

  // VALIDATION
  // handles user input for PIN field
  handlePIN = e => this.setState({ PIN: e.target.value });

  // validates PIN input on blur
  checkPINonBlur = () => {
    const {
      checkPINResponses: checkPINResponsesAction,
      getParticipantByPIN: getParticipantByPINAction,
    } = this.props;
    const { surveyParts, PIN } = this.state;

    if (PIN.length < 5) {
      this.setState({
        PINerror: 'PIN must contain 5 characters',
        PINvalid: false,
      });
    }
    if (PIN.length === 5) {
      // check if PIN is in right format
      if (!validPIN(PIN)) {
        this.setState({
          PINerror: 'PIN must be in the right format',
          PINvalid: false,
        });
      } else {
        this.setState({ PINerror: '', PINvalid: true });
      }
      // check if PIN alrady submitted this exact survey
      checkPINResponsesAction(surveyParts, PIN);
      getParticipantByPINAction(PIN);
    }
  };

  // submits and validates PIN request
  submitPIN = () => {
    // const { PIN } = this.state;
    const {
      PINExist,
      // getParticipantByPIN: getParticipantByPINAction,
    } = this.props;

    if (PINExist) {
      // check if PIN alrady submitted survey
      Modal.error({
        title: 'Error!',
        content: "The PIN you've entered has already submitted this survey.",
        onOk: this.sectionChange('back'),
      });
    }
    // getParticipantByPINAction(PIN);
  };

  // SURVEY FUNCTIONS
  // function that will check if the div for the answer has been selected and if so add that answer to the formstate
  selectCheckedItem = (value, questionId) => {
    const { formState } = this.state;
    formState[questionId] = value;
    this.setState({ formState }, () => {
      this.trackAnswers();
    });
  };

  // function to track progress on survey
  trackAnswers = () => {
    const { formState } = this.state;
    const { surveyData } = this.props;
    const { surveyData: surveyDetails } = surveyData;

    if (formState && surveyDetails) {
      const numberOfQs = surveyDetails.questionsForSurvey.length;
      const numberOfAs = Object.values(formState).length;
      const rate = Math.ceil((numberOfAs / numberOfQs) * 100);

      this.setState({ completionRate: rate });
    } else {
      this.setState({ completionRate: 0 });
    }
  };

  // validates and adds postcode input (UK format only)
  onChangePostcode = e => {
    const question = e.target.name;
    const { formState } = this.state;
    const answer = { answer: e.target.value, question };

    this.setState(
      {
        postcodeValid: validPostcode(e.target.value),
        formState: { ...formState, [question]: answer },
      },
      () => {
        this.trackAnswers();
      }
    );
  };

  // check for any changes to the survey inputs and add them to the formstate
  handleChange = e => {
    const { group, field } = e.target.dataset;
    const question = e.target.name;
    const { formState } = this.state;
    // if any other type we assign the value to answer and put it in the state
    const answer = { answer: e.target.value, question };
    if (group === 'demographic') {
      answer.participantField = field;
    }
    this.setState({ formState: { ...formState, [question]: answer } }, () => {
      this.trackAnswers();
    });
  };

  handleAntdDatePicker = (question, value, group, field) => {
    // const question = e.target.name;
    const { formState } = this.state;
    // if any other type we assign the value to answer and put it in the state
    const answer = { answer: value, question };
    if (group === 'demographic') {
      answer.participantField = field;
    }
    this.setState({ formState: { ...formState, [question]: answer } }, () => {
      this.trackAnswers();
    });
  };

  // handles case when user selects 'other'
  handleOther = e => {
    const question = e.target.name;
    const { formState } = this.state;
    const { group, field } = e.target.dataset;

    const answer = { answer: `Other: ${e.target.value}`, question };
    if (group === 'demographic') {
      answer.participantField = field;
    }
    this.setState({ formState: { ...formState, [question]: answer } }, () => {
      this.trackAnswers();
    });
  };

  // when participant submits form
  // this puts the required info into an object and sends to server
  handleSubmit = e => {
    e.preventDefault();
    const { surveyData, submitSurvey: submitSurveyAction } = this.props;

    const { surveyType } = surveyData.surveyData;
    const { sessionId } = surveyData.surveyData;
    const { formState, PIN, disagreedToResearch } = this.state;

    const formSubmission = {
      PIN: PIN && PIN.toUpperCase(),
      sessionId,
      surveyType,
      formState,
      disagreedToResearch,
    };
    if (PIN) {
      submitSurveyAction(formSubmission);
    }
    return swal.fire({
      title: 'Please enter a correct PIN',
      type: 'error',
    });
  };

  render() {
    const {
      formState,
      section,
      PINerror,
      PINvalid,
      postcodeValid,
      completionRate,
    } = this.state;

    const { surveyData, errors } = this.props;
    const { uniqueGroups } = surveyData;

    const loadingError = Object.keys(surveyData.msg).length > 0;

    const { surveyData: surveyDetails } = surveyData;
    const answers = Object.keys(formState);

    const surveyGroups = [
      'demographic',
      'Behavioural Insights',
      'about your trainer',
      'about your usual way of teaching',
    ];

    return (
      <div>
        {!surveyData.loaded ? (
          <SpinWrapper>
            <Spin size="large" />
          </SpinWrapper>
        ) : (
          <Container>
            <Header type="home" />
            {loadingError && (
              <Alert message={surveyData.msg} type="warning" showIcon />
            )}
            {surveyDetails && surveyDetails !== null && (
              <Form onSubmit={this.handleSubmit}>
                {section === 'confirmSurvey' && (
                  <ConfirmSurvey
                    sessionDate={surveyData.surveyData.sessionDate}
                    trainerNames={surveyData.surveyData.trainerNames}
                    surveyType={surveyData.surveyData.surveyType}
                    sectionChange={this.sectionChange}
                    researchConfirm={this.researchConfirm}
                  />
                )}
                {section === 'enterPIN' && (
                  <EnterPIN
                    handlePIN={this.handlePIN}
                    onPINBlur={this.checkPINonBlur}
                    renderSkipButtons={this.renderSkipButtons(
                      'enterPIN',
                      !PINvalid,
                      uniqueGroups
                    )}
                    PINerror={PINerror}
                    completionRate={completionRate}
                  />
                )}

                {surveyGroups.includes(section) &&
                  uniqueGroups.map(group => {
                    console.log('map', group);
                    const questions =
                      surveyDetails &&
                      surveyDetails.questionsForSurvey.filter(
                        question => question.group === group
                      );

                    if (section === group) {
                      const unanswered = questions
                        .map(q => q._id)
                        .filter(q => !answers.includes(q));

                      return (
                        <SurveyQs
                          questions={questions}
                          postcodeValid={postcodeValid}
                          onChangePostcode={this.onChangePostcode}
                          onChange={this.handleChange}
                          handleOther={this.handleOther}
                          answers={formState}
                          selectCheckedItem={this.selectCheckedItem}
                          errors={errors}
                          handleAntdDatePicker={this.handleAntdDatePicker}
                          renderSkipButtons={this.renderSkipButtons(
                            group,
                            unanswered.length > 0 || !postcodeValid,
                            uniqueGroups,
                            completionRate
                          )}
                          completionRate={completionRate}
                        />
                      );
                    }
                    return null;
                  })}
                {completionRate === 100 && (
                  <button type="submit">Submit Feedback</button>
                )}
              </Form>
            )}
          </Container>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    surveyData: state.survey,
    PINExist: state.survey.PINExist,
    skipDemo: state.survey.skipDemo,
    errors: state.survey.errors,
  };
};

export default connect(
  mapStateToProps,
  { fetchSurveyData, checkPINResponses, submitSurvey, getParticipantByPIN }
)(Survey);
