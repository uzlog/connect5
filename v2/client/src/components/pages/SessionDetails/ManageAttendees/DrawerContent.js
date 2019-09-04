import React from 'react';

import UpdateAttendeesList from './UpdateAttendeesList';
import SendReminderEmails from './SendReminderEmails';
import ViewEmailsList from './ViewEmailsList';
import EmailTemplate from './EmailTemplate';

const DrawerContent = ({
  sessionDetails,
  loading,
  drawerKey,
  onSelectBlur,
  onSelectFocus,
  onCopy,
  onClear,
  // update
  handleSubmitUpdateAttendees,
  confirmedAttendeesList,
  handleUpdateAttendees,
  // send emails
  changeSelectedEmails,
  checkedEmails,
  isCheckAll,
  onCheckAllChange,
  submitSendReminderEmail,
  // emails list
  reminderEmails,
  handleDrawerOpen,
  // email template
  activeEmailTemplate,
}) => {
  switch (drawerKey) {
    case 'viewAttendeesList':
      return (
        <UpdateAttendeesList
          handleSubmitUpdateAttendees={handleSubmitUpdateAttendees}
          confirmedAttendeesList={confirmedAttendeesList}
          handleUpdateAttendees={handleUpdateAttendees}
          onSelectBlur={onSelectBlur}
          onSelectFocus={onSelectFocus}
          onCopy={onCopy}
          onClear={onClear}
          loading={loading}
        />
      );

    case 'sendEmails':
      return (
        <SendReminderEmails
          confirmedAttendeesList={confirmedAttendeesList}
          changeSelectedEmails={changeSelectedEmails}
          checkedEmails={checkedEmails}
          isCheckAll={isCheckAll}
          onCheckAllChange={onCheckAllChange}
          submitSendReminderEmail={submitSendReminderEmail}
          sessionDetails={sessionDetails}
          loading={loading}
        />
      );

    case 'viewEmails':
      return (
        <ViewEmailsList
          reminderEmails={reminderEmails}
          handleDrawerOpen={handleDrawerOpen}
          loading={loading}
        />
      );

    case 'emailTemplate':
      return <EmailTemplate activeEmailTemplate={activeEmailTemplate} />;

    default:
      return null;
  }
};

export default DrawerContent;
