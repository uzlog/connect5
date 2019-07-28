/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { DatePicker, Select, Input, Checkbox, Icon, Divider } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import Button from '../../common/Button';
import { fetchAllTrainers } from '../../../actions/trainerAction';
import {
  fetchLocalLeads,
  fetchLocalLeadTrainersGroup,
} from '../../../actions/users';
import { createSessionAction } from '../../../actions/sessionAction';
import { sessions, regions, pattern } from './options';

import {
  Form,
  CreateSessionWrapper,
  InputDiv,
  Heading,
  SubmitBtn,
  Error,
  Warning,
} from './create-session.style';

const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i += 1) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const initialState = {
  session: null,
  startDate: null,
  inviteesNumber: null,
  region: null,
  partnerTrainer1: { key: '', label: '' },
  partnerTrainer2: { key: '', label: '' },
  emails: [],
  sendByEmail: false,
  err: false,
  trainersNames: {},
};

class CreateSession extends Component {
  state = initialState;

  componentDidMount() {
    const { id, role } = this.props;
    if (this.props.location.state) {
      this.setState({
        ...this.props.location.state,
        startDate: moment(this.props.location.state.startDate),
      });
    }

    if (role === 'localLead') {
      this.props.fetchLocalLeadTrainersGroup(id);
    } else {
      this.props.fetchAllTrainers();
      this.props.fetchLocalLeads();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.fetchLocalLeadsAndTrainers();
    }
  }

  fetchLocalLeadsAndTrainers = () => {
    const { id, role } = this.props.currentUser;
    if (role && role === 'localLead') {
      this.props.fetchLocalLeadTrainersGroup(id);
    } else {
      this.props.fetchAllTrainers();
      this.props.fetchLocalLeads();
    }
  };

  onChangeCheckbox = e => {
    this.setState({ sendByEmail: e.target.checked });
  };

  onDateChange = defaultValue => {
    this.setState({
      startDate: defaultValue,
    });
  };

  onInputChange = ({ target: { value, name } }) => {
    this.setState({
      [name]: value,
    });
  };

  onSelectSessionChange = value => {
    this.setState({
      session: value,
    });
  };

  onSelectRegionChange = value => {
    this.setState({
      region: value,
    });
  };

  onSelectPartner1Change = item => {
    const { trainersNames } = this.state;

    this.setState({
      partnerTrainer1: item,
      trainersNames: { ...trainersNames, [item.label]: item.label },
    });
  };

  onSelectPartner2Change = item => {
    const { trainersNames } = this.state;

    this.setState({
      partnerTrainer2: item,
      trainersNames: { ...trainersNames, [item.label]: item.label },
    });
  };

  onEmailChange = value => {
    let err = '';
    const valuesToBeStored = [];
    // check for email validation
    value.forEach(item => {
      if (pattern.test(item)) {
        valuesToBeStored.push(item);
      } else {
        err = '*please enter valid email';
      }
    });

    this.setState({
      emails: valuesToBeStored,
      err,
    });
  };

  renderTrainersList = () => {
    const { leadsAndTrainers, role, localLeadTrainersGroup, id } = this.props;
    if (role && role === 'localLead') {
      if (localLeadTrainersGroup) {
        return localLeadTrainersGroup
          .filter(({ _id }) => _id !== id)
          .map(({ name, _id }) => {
            return (
              <Option
                key={_id}
                value={_id}
                style={{ textTransform: 'capitalize' }}
              >
                {name}
              </Option>
            );
          });
      }
    } else if (leadsAndTrainers) {
      return leadsAndTrainers
        .filter(({ _id }) => _id !== id)
        .map(({ name, _id }) => (
          <Option key={_id} value={_id} style={{ textTransform: 'capitalize' }}>
            {name}
          </Option>
        ));
    }
    return null;
  };

  checkError = () => {
    const { startDate, inviteesNumber, session, region, emails } = this.state;
    const isError = !(
      !!startDate &&
      !!inviteesNumber &&
      !!session &&
      !!region &&
      !!emails
    );

    this.setState({
      err: isError,
    });
    return isError;
  };

  onFormSubmit = event => {
    event.preventDefault();
    const {
      session,
      startDate,
      inviteesNumber,
      region,
      partnerTrainer1,
      partnerTrainer2,
      emails,
      sendByEmail,
      trainersNames,
    } = this.state;

    const sessionData = {
      session,
      startDate,
      inviteesNumber,
      region,
      partnerTrainer1: partnerTrainer1.key,
      partnerTrainer2: partnerTrainer2.key,
      emails,
      sendByEmail,
      trainersNames,
    };
    // CHECK FOR ERRORS IF NOT THEN CALL ACTION CREATOR AND GIVE IT sessionData
    return !this.checkError() && this.props.createSessionAction(sessionData);
  };

  render() {
    const { role } = this.props;

    const {
      inviteesNumber,
      err,
      session,
      partnerTrainer1,
      partnerTrainer2,
      emails,
      startDate,
      region,
    } = this.state;

    const {
      onDateChange,
      onInputChange,
      onSelectSessionChange,
      onSelectRegionChange,
      onSelectPartner1Change,
      onSelectPartner2Change,
      onEmailChange,
      onFormSubmit,
    } = this;

    return (
      <CreateSessionWrapper>
        <Heading>Create New Session</Heading>
        <Form onSubmit={onFormSubmit}>
          <InputDiv>
            <DatePicker
              onChange={onDateChange}
              name="startDate"
              size="large"
              style={{ width: '100%' }}
            />
            {startDate === null && <Warning>* required</Warning>}
          </InputDiv>

          <InputDiv>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Click to select session No."
              optionFilterProp="children"
              onChange={onSelectSessionChange}
              size="large"
              value={session || undefined}
            >
              {sessions.map(({ value, label }) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
            {session === null && <Warning>* required</Warning>}
          </InputDiv>

          <InputDiv>
            <Input
              type="number"
              placeholder="Number of attendees (this can be an estimate)"
              value={inviteesNumber}
              onChange={onInputChange}
              name="inviteesNumber"
              size="large"
              min="0"
            />
            {inviteesNumber === null && <Warning>* required</Warning>}
          </InputDiv>

          <InputDiv>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Region"
              optionFilterProp="children"
              onChange={onSelectRegionChange}
              size="large"
              value={region || undefined}
            >
              {regions.map(reg => (
                <Option key={reg} value={reg}>
                  {reg}
                </Option>
              ))}
            </Select>
            {region === null && <Warning>* required</Warning>}
          </InputDiv>

          <InputDiv>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Partner Trainer"
              optionFilterProp="children"
              onChange={onSelectPartner1Change}
              labelInValue
              size="large"
              value={partnerTrainer1.key ? partnerTrainer1 : undefined}
              dropdownRender={menu => (
                <div
                  onMouseDown={e => {
                    e.preventDefault();
                    return false;
                  }}
                >
                  {role === 'localLead' && (
                    <>
                      <div
                        onClick={() => {
                          this.props.history.push({
                            pathname: '/add-trainer',
                            state: {
                              ...this.state,
                              startDate:
                                this.state.startDate &&
                                this.state.startDate.valueOf(),
                            },
                          });
                        }}
                        style={{
                          padding: '8px',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          display: 'block',
                        }}
                      >
                        <Icon type="plus" /> Register New Trainer
                      </div>
                      <Divider style={{ margin: '4px 0' }} />{' '}
                    </>
                  )}
                  {menu}
                </div>
              )}
            >
              {this.renderTrainersList()}
            </Select>
          </InputDiv>
          {role === 'localLead' && (
            <InputDiv>
              <Select
                placeholder="Second Partner Trainer"
                optionFilterProp="children"
                onChange={onSelectPartner2Change}
                size="large"
                showSearch
                style={{ width: '100%' }}
                value={partnerTrainer2.key ? partnerTrainer2 : undefined}
                labelInValue
                dropdownRender={menu => (
                  <div
                    onMouseDown={e => {
                      e.preventDefault();
                      return false;
                    }}
                  >
                    <div
                      onClick={() => {
                        this.props.history.push({
                          pathname: '/add-trainer',
                          state: {
                            ...this.state,
                            startDate:
                              this.state.startDate &&
                              this.state.startDate.valueOf(),
                          },
                        });
                      }}
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      <Icon type="plus" /> Register New Trainer
                    </div>
                    <Divider style={{ margin: '4px 0' }} />
                    {menu}
                  </div>
                )}
              >
                {this.renderTrainersList()}
              </Select>
            </InputDiv>
          )}

          <InputDiv>
            <Select
              mode="tags"
              size="large"
              placeholder="Enter emails for people to invite"
              onChange={onEmailChange}
              style={{ width: '100%', height: '100%' }}
              value={emails}
            />
            <div>{err}</div>
          </InputDiv>
          <InputDiv>
            <Checkbox onChange={this.onChangeCheckbox}>
              Send a session invite to potential participants by email
            </Checkbox>
          </InputDiv>

          <SubmitBtn>
            <Button
              onClick={onFormSubmit}
              type="primary"
              label="Submit"
              height="40px"
              width="100%"
            />
          </SubmitBtn>
          {err && <Error>Please fill in all required inputs</Error>}
        </Form>
      </CreateSessionWrapper>
    );
  }
}

const mapStateToProps = state => {
  const { trainers } = state.trainers;
  const localLeads = state.fetchedData.localLeadsList;

  const leadsAndTrainers = [...localLeads, ...trainers];
  return {
    id: state.auth.id,
    role: state.auth.role,
    currentUser: state.auth,
    localLeadTrainersGroup: state.fetchedData.localLeadGroup,
    leadsAndTrainers,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchAllTrainers,
    createSessionAction,
    fetchLocalLeads,
    fetchLocalLeadTrainersGroup,
  }
)(CreateSession);
