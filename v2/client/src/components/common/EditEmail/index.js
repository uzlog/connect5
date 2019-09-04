import React, { Component } from 'react';
import {
  Alert,
  Select,
  Icon,
  Input,
  Modal,
  message,
  Tooltip,
  Button as AntButton,
  Collapse,
  Checkbox,
  Row,
  Col,
} from 'antd';

import { connect } from 'react-redux';
import * as Yup from 'yup';

import { MY_SESSIONS_URL } from '../../../constants/navigationRoutes';
import Header from '../Header';
import InfoPopUp from '../InfoPopup';

import history from '../../../history';

import EmailTemplate from '../EmailTemplate';
import Button from '../Button';

import { sendEmailInvitation as sendEmailInvitationAction } from '../../../actions/InviteAndPromoteAction';

import {
  Wrapper,
  SuccessMessageDiv,
  SubHeader,
  StyledLink,
  Paragraph,
  Label,
  SelecetWrapper,
  IconsWrapper,
} from './EditEmail.style';

const customPanelStyle = {
  // background: '#f7f7f7',
  background: '#fff',
  borderRadius: 4,
  // marginBottom: 24,
  border: 0,
  overflow: 'hidden',
  padding: '0.5rem',
};

const { Panel } = Collapse;

const defaultCheckedList = ['Apple', 'Orange'];

const emailSchema = Yup.string()
  .email()
  .required();

const { TextArea } = Input;

const { Option } = Select;
const details =
  'Email addresses of invitees can be either added one by one or copied from a list separated by commas, spaces etc. This list is not required to set up sessions. It can be created/updated in continuation.';

class EditEmail extends Component {
  state = {
    isEditView: false,
    participantEmails: [],
    isCollapsOpen: true,
    checkedList: defaultCheckedList,
    indeterminateAll: false,
    isAllChecked: true,
    isNewChecked: true,
  };

  componentDidMount() {
    const { participantEmails } = this.props;
    const plainAllEmails = participantEmails.map(item => item.email);
    const plainNewEmails = participantEmails
      .filter(item => item.status === 'new')
      .map(item => item.email);

    this.setState({
      participantEmails,
      plainAllEmails,
      plainNewEmails,
      checkedList: plainAllEmails,
    });
  }

  componentWillUnmount() {
    document.removeEventListener('paste', this.pasteEmails);
  }

  toggleEditView = visible => {
    this.setState({ isEditView: visible });
  };

  handleExtraInformation = e => {
    const { value } = e.target;
    this.setState({ extraInformation: value });
  };

  handleUpdateEmails = values => {
    const validEmails = [];

    values.forEach(item => {
      if (!validEmails.some(_item => _item.email === item)) {
        try {
          const validEmail = emailSchema.validateSync(item);

          if (validEmail) {
            validEmails.push({ email: item });
          }
        } catch (err) {
          Modal.error({
            title: 'Invalid!',
            content: err.errors[0],
          });
        }
      }
    });

    this.setState({ participantEmails: validEmails });
  };

  handleSendEmail = () => {
    // type of email to be sent
    const { type } = this.props;
    switch (type) {
      case 'registration':
        return this.sendRegistrationEmail();

      default:
    }
  };

  sendRegistrationEmail = () => {
    const { participantEmails, extraInformation } = this.state;
    const {
      sessionId: _id,
      sessionDate,
      sessionType,
      trainers,
      startTime,
      endTime,
      shortId,
      address,
      sendEmailInvitation,
    } = this.props;

    const recipients = participantEmails.map(email => {
      return { ...email, status: 'sent' };
    });

    const InviteData = {
      _id,
      recipients,
      sendDate: new Date(),
      sessionDate,
      sessionType,
      // string of trainers' names
      trainers,
      startTime,
      endTime,
      shortId,
      address,
      extraInformation,
      confirmedEmails: [],
    };

    sendEmailInvitation(InviteData, this.done);
  };

  done = () => {
    const { backCallback } = this.props;

    Modal.success({
      title: 'Done!',
      content: 'Invitation Email successfully sent',
      onOk: () => {
        if (typeof backCallback === 'function') return backCallback();
        return history.push(MY_SESSIONS_URL);
      },
    });
  };

  onSelectBlur = () => {
    this.setState({ focused: false });
  };

  onSelectFocus = () => {
    this.setState({ focused: true });
  };

  onCopy = () => {
    const { participantEmails } = this.state;

    if (participantEmails.length) {
      const copyText = document.getElementById('participantEmails');
      let range;
      let selection;
      if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(copyText);

        range.select();
      } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(copyText);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      try {
        document.execCommand('copy');
        message.success('copied');
      } catch (err) {
        console.log(err);
      }
    }
  };

  pasteEmails = event => {
    const { focused, emails } = this.state;

    let emailsArray;

    if (focused) {
      event.preventDefault();
      const pastedString = event.clipboardData.getData('text/plain');
      const splittedEmails = pastedString.split(';');
      if (pastedString === splittedEmails) {
        emailsArray = pastedString.split(';');
      }
      emailsArray = splittedEmails
        .map(item => item.trim())
        .filter(item => !emails.includes(item));

      this.onEmailChange([...emails, ...emailsArray]);
    }
  };

  // to set a flag whether the collaps is opened or not
  toggleOpenCollaps = activeKeys => {
    this.setState({ isCollapsOpen: !!(activeKeys && activeKeys.length > 0) });
  };

  // to handle individual emails checkboxes changes
  onChangeCheckbox = checkedList => {
    const { participantEmails, plainNewEmails } = this.state;
    const isAllChecked = checkedList.length === participantEmails.length;
    const isNewChecked =
      plainNewEmails.length > 0 &&
      checkedList.length > 0 &&
      checkedList.every(item => plainNewEmails.includes(item));

    this.setState({
      checkedList,
      indeterminateAll:
        !!checkedList.length && checkedList.length < participantEmails.length,
      isAllChecked,
      isNewChecked,
    });
  };

  // to handle toggle the checkbox for "seslect all" checbox
  onCheckAllChange = e => {
    const { plainAllEmails } = this.state;
    this.setState({
      checkedList: e.target.checked ? plainAllEmails : [],
      indeterminateAll: false,
      isAllChecked: e.target.checked,
      isNewChecked: e.target.checked,
    });
  };

  // to handle toggle the checkbox for "seslect new" checbox
  onCheckNewChange = e => {
    const { plainNewEmails } = this.state;

    this.setState({
      checkedList: e.target.checked ? plainNewEmails : [],
      isNewChecked: e.target.checked,
      isAllChecked: false,
    });
  };

  render() {
    const {
      successMessage,
      sessionId,
      // Boolean
      canAddParticipants,
      // registration
      shortId,

      // template details
      type,
      trainer,
      sessionDate,
      sessionType,
      address,
      trainers,
      startTime,
      endTime,
      backCallback,
      preSurveyLink,
      postSurveyLink,
    } = this.props;

    const {
      isEditView,
      extraInformation,
      participantEmails,
      isCollapsOpen,
      checkedList,
      indeterminateAll,
      isAllChecked,
      isNewChecked,
    } = this.state;

    return (
      <>
        <Header label="Edit Session" type="view" />
        <Wrapper>
          {isEditView ? (
            <>
              <SubHeader>Extra information:</SubHeader>
              <Paragraph>
                Write below any extra information you would like to add to the
                email before you send out
              </Paragraph>
              <TextArea
                placeholder="Type here"
                autosize={{ minRows: 4, maxRows: 6 }}
                style={{ marginBottom: '20px' }}
                onChange={this.handleExtraInformation}
                value={extraInformation}
              />

              <SubHeader>Core information:</SubHeader>
              <Paragraph>
                This information cannot be edited. To make changes{' '}
                <StyledLink to={`/session-edit/${sessionId}`}>
                  click here
                </StyledLink>{' '}
                to edit the session directly.
              </Paragraph>
            </>
          ) : (
            <>
              {successMessage && (
                <SuccessMessageDiv>
                  <Alert
                    message={
                      <span>
                        <Icon
                          type="check-circle"
                          theme="filled"
                          style={{ color: '#52c41a', marginRight: '1rem' }}
                        />
                        {successMessage}
                      </span>
                    }
                    type="success"
                  />
                </SuccessMessageDiv>
              )}
              <>
                <SubHeader>Registration Link:</SubHeader>
                <StyledLink
                  to={`/confirm/${shortId}`}
                >{`${window.location.host}/confirm/${shortId}`}</StyledLink>
                <Paragraph>
                  Copy the link above to share with potential participants so
                  they can register and let you know about any special
                  requirements.
                </Paragraph>
              </>
              <>
                <SubHeader>Invite Participants via email: </SubHeader>
                <Paragraph>
                  Send a session invite to participants via email, providing
                  them a link to register and let you know about any special
                  requirements.
                </Paragraph>
              </>
              <>
                <SelecetWrapper>
                  <IconsWrapper>
                    <Tooltip placement="top" title="Copy">
                      <AntButton
                        type="primary"
                        icon="copy"
                        ghost
                        onClick={this.onCopy}
                      />
                    </Tooltip>
                    <InfoPopUp details={details} />
                  </IconsWrapper>

                  <Label>Email addresses:</Label>
                  {canAddParticipants ? (
                    <Select
                      mode="tags"
                      id="participantEmails"
                      // get emails string array
                      value={participantEmails.map(item => item.email)}
                      placeholder="Type or paste the email addresses here"
                      onChange={this.handleUpdateEmails}
                      style={{ width: '100%' }}
                      size="large"
                      onBlur={this.onSelectBlur}
                      onFocus={this.onSelectFocus}
                    >
                      {participantEmails.map(item => (
                        <Option value={item.email}>{item.email}</Option>
                      ))}
                    </Select>
                  ) : (
                    <div style={{ width: '100%' }}>
                      <Collapse
                        bordered={false}
                        defaultActiveKey={['1']}
                        expandIcon={({ isActive }) => (
                          <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                        )}
                        style={{ border: '2px solid' }}
                        onChange={this.toggleOpenCollaps}
                        expandIconPosition="right"
                      >
                        <Panel
                          header={<div>Select from your invite list</div>}
                          key="1"
                          style={customPanelStyle}
                        >
                          <div
                            style={{
                              borderBottom: '1px solid #E9E9E9',
                              display: 'flex',
                              width: '100%',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Checkbox
                              indeterminate={indeterminateAll}
                              onChange={this.onCheckAllChange}
                              checked={isAllChecked}
                            >
                              Select all
                            </Checkbox>
                            <Checkbox
                              onChange={this.onCheckNewChange}
                              checked={isNewChecked}
                            >
                              Select New
                            </Checkbox>
                          </div>
                          <br />

                          <Checkbox.Group
                            style={{ width: '100%' }}
                            onChange={this.onChangeCheckbox}
                            value={checkedList}
                          >
                            <Row id="selectGroup">
                              {participantEmails.map(item => (
                                <Col span={24}>
                                  <Checkbox value={item.email}>
                                    <span
                                      style={{
                                        width: '80%',
                                        display: 'inline-flex',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      {item.email}
                                      <span>{item.status}</span>
                                    </span>
                                  </Checkbox>
                                </Col>
                              ))}
                            </Row>
                          </Checkbox.Group>
                          <div>d</div>
                        </Panel>
                      </Collapse>
                    </div>
                  )}
                </SelecetWrapper>
              </>
            </>
          )}
          <>
            <EmailTemplate
              type={type}
              trainer={trainer}
              sessionDate={sessionDate}
              sessionType={sessionType}
              address={address}
              trainers={trainers}
              startTime={startTime}
              endTime={endTime}
              extraInformation={extraInformation}
              preSurveyLink={preSurveyLink}
              postSurveyLink={postSurveyLink}
            />
          </>
          {isEditView ? (
            <Button
              onClick={() => this.toggleEditView(false)}
              type="primary"
              label="Save changes"
              height="40px"
              width="100%"
              style={{ marginBottom: '1.5rem' }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {' '}
              <Button
                onClick={() => this.toggleEditView(true)}
                type="primary"
                label="Edit email"
                height="40px"
                width="100%"
                style={{ marginBottom: '1.5rem' }}
              />
              <Button
                onClick={this.handleSendEmail}
                type="primary"
                label="Send email"
                height="40px"
                width="100%"
                style={{ marginBottom: '1.5rem' }}
              />
              <SubHeader
                as="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  margin: '0 auto 2rem',
                }}
                onClick={() => {
                  if (typeof backCallback === 'function') return backCallback();
                  return history.push(MY_SESSIONS_URL);
                }}
              >
                Skip and view my session
              </SubHeader>
            </div>
          )}
        </Wrapper>
      </>
    );
  }
}

export default connect(
  null,
  { sendEmailInvitation: sendEmailInvitationAction }
)(EditEmail);
