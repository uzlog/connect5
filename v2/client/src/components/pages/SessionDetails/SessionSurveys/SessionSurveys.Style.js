import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '../../../../theme';

export const SessionSurveysWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  padding-top: 0;
`;

export const SessionSurveyContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-bottom: 2rem;
  border-radius: 5px;
  background: ${colors.white};
  box-shadow: rgb(204, 204, 204) 0px 0px 6px;
`;

export const SurveyContentWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

export const Buttons = styled.div`
  width: 90%;
  margin: 0 auto;
  padding-top; 2rem
`;

export const SurveyLinkType = styled(Link)`
  display: inline-block;
  padding: 1rem;
  color: #000;
  text-decoration: none;
`;

export const SurveyLinkInfo = styled.span`
  display: inline-block;
  cursor: pointer;
`;

export const ViewResultIcon = styled.span`
  display: inline-block;
  cursor: pointer;
  margin-left: 0.3rem;
  color: ${colors.black};
`;

export const CopyLink = styled.span`
  display: inline-block;
  width: 45%;
  margin: 1rem 0 1rem 0.55rem;
  cursor: pointer;
`;

export const MailLink = styled.span`
  display: inline-block;
  width: 50%;
  cursor: pointer;
`;

export const IconName = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
`;

export const SurveyLink = styled(Link)`
  text-decoration: none;
  display: block;
  padding: 0.5rem;
  margin-left: 0.5rem;
  color: ${colors.blackSecondary};
  cursor: default;
  word-break: break-all;
  font-size: 14px;
  & :hover {
    color: blue;
    text-decoration: underline;
  }
`;

export const AttendeeBtn = styled.button`
  background-color: ${colors.lightPrimary};
  border-radius: 15px;
  border: 1px solid ${colors.lightPrimary};
  width: 200px;
  display: block;
  text-align: center;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 2rem;
  cursor: pointer;
  color: ${colors.white};
  font-size: 1rem;
  padding: 14px 15px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #2f6627;
  &:hover {
  background-color: ${colors.white};
  color: ${colors.lightPrimary};
  border: 1px solid ${colors.lightPrimary}
  }
  &:active {
  position:relative;
  top:1px;
`;

export const SurveyResult = styled(Link)`
  display: block;
  width: 130px;
  text-decoration: none;
  padding: 9px 10px;
  font-size: 0.89rem;
  border-radius: 9px;
  color: ${colors.white};
  background: ${colors.lightPrimary};
  margin: 0 auto;
  margin-top: .8rem;
  margin-bottom: .8rem;
  font-weight: 600;
  border: 1px solid ${colors.lightPrimary};
  &:hover {
  background-color: ${colors.white};
  color: ${colors.lightPrimary};
  border: 1px solid ${colors.lightPrimary}
  }
  &:active {
  position:relative;
  top:1px;
`;

export const ModalButtonsDiv = styled.div`
  display: flex;
  margin-top: 2rem;
  margin-left: 45%;
  @media (min-width: 768px) {
    margin-left: 55%;
`;
